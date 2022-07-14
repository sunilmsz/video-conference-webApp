import React, { useEffect, useState, useRef ,useCallback} from 'react'
import { io } from "socket.io-client"
import Peer from 'peerjs';
import { useParams } from 'react-router-dom';
import { default as VideoComponent } from '../components/Video';
import { v4 as uuidV4 } from 'uuid';
import { useNavigate, useLocation } from "react-router-dom"
import axios from 'axios'
import { BsFillMicMuteFill,BsFillMicFill ,BsCameraVideoFill,BsFillCameraVideoOffFill} from 'react-icons/bs';
import {MdScreenShare,MdStopScreenShare,MdMicOff,MdMic} from 'react-icons/md'

const Video = () => {

    const { roomId } = useParams();
    const [videoData, setVideoData] = useState([])
    const [streamData, setStreamData] = useState([])
    const [disconnectedId, setDisconnectedId] = useState(new Set())
    const [screenData, setScreenData] = useState({})
    const [screenStatus, setScreenStatus] = useState(false)
    const [videoStatus, setVideoStatus] = useState(false)
    const [audioStatus, setAudioStatus] = useState(false)
    const [myVideoData, setMyVideoData] = useState({})
    const socketRef = useRef();
    const [stoppedUser, setStoppedUser] = useState([])
    const [otherScreenState,setOtherScreenState] = useState(false)
    const otherScreenStatus = useRef(false)
    const screenRef = useRef(false)
    const callData = useRef()
    const streamObject = useRef()
    const peerRef = useRef()
    const socketPeerMap = useRef()
    const navigate = useNavigate()
    const tempStreamObj = useRef()
    const location = useLocation()
    

    const callLogin = async () => {
        try {
          const options = {
            method: "post",
            url: "/api/users/dashboard",
            headers: {
              "Content-Type": "application/json",
              'Accept': 'application/json'
            },
            withCredentials: true
          }
          const response = await axios(options)
          const data = response.data
          console.log(data)
          if (data.msg === "Success")
             {return true;}
        }
        catch (error) {
          if (error.response.data.msg != "Success") {
            navigate("/")
          }
        }
      }
  


    useEffect(() => {

        async function immediate (){
            
        if (!location.state)
         {
            const response =await  callLogin()
            if(!response)
            return
        }
       streamObject.current = await  navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
            connect()
        }
        
        immediate ()
        return () => {

            socketRef.current?.disconnect()
            peerRef.current?.destroy()

            streamObject.current?.getVideoTracks()[0].stop()
            streamObject.current?.getAudioTracks()[0].stop()
            tempStreamObj.current?.getVideoTracks()[0].stop()
            tempStreamObj.current?.getAudioTracks()[0].stop()




        }

    }, [])


    const connect = useCallback( ()=> {
       
        const socket = (io("/"))

        socketRef.current = socket;
        const peer = new Peer(uuidV4(), { path: "/peerjs", host: "/" })
        
       
        peer.on("open", id => {
            socket.emit("nuser-joined", roomId, id)
            peerRef.current = peer
        })

        socketPeerMap.current = new Map()
      

        callData.current=[]
        //     stream.getAudioTracks()[0].enabled == false;
        
        setMyVideoData({ id: socket.id, stream: streamObject.current, muted: true, nodisplay: false })
       
        setVideoStatus(true);
        setAudioStatus(true)
        // setVideoData([...videoData, { id: socket.id, stream: stream, muted: true }])
       
      
      
        socket.on("user-connected", (peerId, socket_id) => {
            const call = peer.call(peerId, streamObject.current, { metadata: { sId: socket.id } })
           callData.current.push(call)
           socketPeerMap.current.set(socket_id,call)
      
            call.on("stream", userVideoStream => {
                setStreamData((data) => [...data, { stream: userVideoStream, socket_id: socket_id, nodisplay: false }])
            })
            setTimeout(()=>emitScreenShare(),2000)
        })

        peer.on('call', function (call) {
            call.answer(streamObject.current);
            callData.current.push(call)
           socketPeerMap.current.set(call.metadata.sId,call)
            call.on('stream', function (remoteStream) {
                setStreamData((data) => [...data, { stream: remoteStream, socket_id: call.metadata.sId, nodisplay: false }])
            })
        })

        socket.on("user-video-stopped", (socket_id) => {
            setStoppedUser([...stoppedUser, socket_id]) 
        }
        )

        socket.on("user-disconnected", (id) => {
            //console.log("peer Connections ---->",peer.connections)
            setDisconnectedId((data) => new Set(data.add(id)))
        })
    },[])




    
    useEffect(() => {
       
        if (streamData.length > 0) {
            const arr = videoData.map(e => e.id)
            for (let i = 0; i < streamData.length; i++) {
                if (!arr.includes(streamData[i].socket_id)) {
                    setVideoData((videoData) => [...videoData, { id: streamData[i].socket_id, stream: streamData[i].stream, muted: false, nodisplay: false }])
                    arr.push(streamData[i].socket_id)
                }
            }

            socketRef.current.on("screenShared",(id)=> {
                console.log("screenShared Event triggered",id)
                console.log(streamData)
                setTimeout(() => {
                    streamData.map( (element)=> {
                        console.log(id,"socketid ------ streamData id-->",element.socket_id)
                            if(id==element.socket_id)
                            {
                                console.log("shared person's video stream --->   ",element.stream.getVideoTracks())
                                console.log("shared person's audio stream --->   ",element.stream.getAudioTracks())

                                setScreenData({id:element.socket_id,stream:element.stream})
                                setOtherScreenState(true)
                                otherScreenStatus.current =true
                            }
                    })
                }, 1000);
            })
        
            socketRef.current.on("screenSharedStopped",()=> {
                console.log("screenSharedstop event trigged")
                setOtherScreenState(false)
                otherScreenStatus.current = false
            })
        

        }
    }, [streamData])


    const startStopVideo = useCallback(() => {


        
        if (videoStatus) {
            console.log("StartStopVieo if part executed")
            myVideoData.stream.getVideoTracks()[0].enabled =false
            setVideoStatus(false)
            console.log(myVideoData.stream, "after stopping video")
           
            socketRef.current.emit("user-video-stopped")
  
        }
        else {
            console.log("StartStopVieo Else part executed")
            myVideoData.stream.getVideoTracks()[0].enabled =true
            setVideoStatus(true)
        }
        // if (videoStatus) {
        //     console.log("StartStopVieo if part executed")
        //     myVideoData.stream.getVideoTracks()[0].stop()
        //     setVideoStatus(false)

        //     navigator.mediaDevices.getUserMedia({
        //         audio: true
        //     }).then((stream) => {

        //         stream.getAudioTracks()[0].enabled=audioStatus
        //         streamObject.current=stream
        //         setMyVideoData({ id: socketRef.current.id, stream:stream, muted: true, nodisplay: false })
               
        //         console.log(myVideoData.stream, "after stopping video")
           
        //          socketRef.current.emit("user-video-stopped")
        //          console.log("tracks",stream.getTracks())

        //         for(let i=0;i<callData.current.length;i++)
        //         {
        //             console.log("sender Data",callData.current[i].peerConnection.getSenders())
        //             callData.current[i].peerConnection.getSenders()[0].replaceTrack(stream.getTracks()[0])
        //             callData.current[i].peerConnection.getSenders()[1].replaceTrack(stream.getTracks()[1])
        //         }
        //     })
            

            
  
        // }
        // else {
        //     console.log("StartStopVieo Else part executed")
        //     navigator.mediaDevices.getUserMedia({
        //         video: true,
        //         audio: true
        //     }).then((stream) => {

        //         stream.getAudioTracks()[0].enabled=audioStatus
        //         streamObject.current=stream
        //         setMyVideoData({ id: socketRef.current.id, stream:stream, muted: true, nodisplay: false })
        //         setVideoStatus(true)
                
        //         console.log("tracks",stream.getTracks())

        //         for(let i=0;i<callData.current.length;i++)
        //         {
        //             console.log("sender Data",callData.current[i].peerConnection.getSenders())

        //            // callData.current[i].peerConnection.getSenders()[0].replaceTrack(stream.getAudioTracks()[0])
        //             callData.current[i].peerConnection.getSenders()[1].replaceTrack(stream.getTracks()[0])
        //         }
        //     })

        // }

    },[videoStatus])


    const muteUnmute = useCallback(() => {
        if (audioStatus) {
            myVideoData.stream.getAudioTracks()[0].enabled = false;
            setAudioStatus(false)
            console.log("after muting", myVideoData.stream)
        }
        else {
            myVideoData.stream.getAudioTracks()[0].enabled = true;
            setAudioStatus(true)
        }
    },[audioStatus])

    const startScreenShare = useCallback(() => {

        
        if (!screenStatus) {

            if(otherScreenStatus.current)
            {
                alert("at a time only one person can share the screen")
                return
            }
            console.log("otherScreen Status",otherScreenStatus.current)
            
            tempStreamObj.current = streamObject.current;
            console.log("temporory holding video stream",tempStreamObj.current.getVideoTracks())
            console.log("temporray holding audio tracks ",tempStreamObj.current.getAudioTracks())
            navigator.mediaDevices.getDisplayMedia({
                video: true
            }).then((stream) => {
                
                console.log("after getting device data")
                console.log("temporory holding video stream",tempStreamObj.current.getVideoTracks())
                console.log("temporray holding audio tracks ",tempStreamObj.current.getAudioTracks())
                stream.addTrack(tempStreamObj.current.getAudioTracks()[0])
                streamObject.current = stream;
                socketRef.current.emit("screenShared",roomId)
                for(let i=0;i<callData.current.length;i++)
                {   console.log(i,"th iteration 1st sender ---> ", callData.current[i]?.peerConnection?.getSenders())
                    console.log("my stream tracks ", stream.getTracks())
                    console.log("myVideoTrack",stream.getVideoTracks())
                    console.log("my audio tracks", stream.getAudioTracks())
                 //  callData.current[i]?.peerConnection?.getSenders()[0]?.replaceTrack(tempStreamObj.current.getAudioTracks()[0])
                    callData.current[i]?.peerConnection?.getSenders()[1]?.replaceTrack(stream.getVideoTracks()[0])
                }


                setScreenData({ id: socketRef.current.id, stream: stream ,muted:true})
                setScreenStatus(true)
                screenRef.current = true;
                stream.getVideoTracks()[0].addEventListener('ended', () => stopScreen())
            }).catch((error) => {console.log("some error occured during sharing screen and error is \n",error) })
        }

        else {
           stopScreen()
        }
    },[screenStatus])


    const emitScreenShare = ()=> {
        console.log("emit Screenshare function executed & screenstatus is ",screenStatus)
        if(screenRef.current)
        socketRef.current.emit("screenShared",roomId)
    }

  const stopScreen = useCallback( ()=> {

    
    console.log("tempStreamObj--->",tempStreamObj)
    console.log("streamObjet --->",streamObject)
    streamObject.current.getVideoTracks()[0].stop()
    console.log("streamObject holding screen data video Stream",streamObject.current.getVideoTracks())
    console.log("streamObject holding screen data audio Stream",streamObject.current.getAudioTracks())
    console.log("temporory holding video stream",tempStreamObj.current.getVideoTracks())
    console.log("temporray holding audio tracks ",tempStreamObj.current.getAudioTracks())
    streamObject.current = tempStreamObj.current;
    screenRef.current =false;
    socketRef.current.emit("screenSharedStopped",roomId)
        console.log("callData Object --->   ",callData.current)
    for(let i=0;i<callData.current.length;i++)
        {       console.log("callData -->",callData.current[i])
                console.log("audio track",callData.current[i]?.peerConnection?.getSenders()[0])
                console.log("video track",callData.current[i]?.peerConnection?.getSenders()[1])
           // callData.current[i]?.peerConnection?.getSenders()[0]?.replaceTrack(tempStreamObj.current.getAudioTracks()[0])
            callData.current[i]?.peerConnection?.getSenders()[1]?.replaceTrack(tempStreamObj.current.getVideoTracks()[0])
        }

    setScreenStatus(false)

  }, [screenStatus])

    useEffect(() => {
        if (disconnectedId.size > 0) {
            
            console.log("removing element executed")

            console.log("socketPeerMap",socketPeerMap.current)

            setVideoData(videoData.filter((e) => !disconnectedId.has(e.id)))
            setStreamData(streamData.filter((e) => !disconnectedId.has(e.socket_id)))

            for(let socket of disconnectedId.values())
            {       
                console.log("disconnected socket id",socket)
                if(socketPeerMap.current.has(socket))
                {
                    socketPeerMap.current.get(socket).close();
                    socketPeerMap.current.delete(socket)
                    if(otherScreenStatus.current)
                    {
                        setOtherScreenState(false)
                        otherScreenStatus.current=false
                    }
                    console.log("after closing peer connection--->",peerRef.current.connections)
                }
            }
        }
    }, [disconnectedId])


    useEffect(() => {
        console.log("stopped user executed ")
        if (stoppedUser.length > 0)
        {       
            let obj;
            const arr = videoData.map((e) => {
                if (stoppedUser.includes(e.id)) {
                    obj =e;
                 const video=   document.getElementById(e.id)
                    setTimeout(() => {
                        video.load()
                    }, 1000); 
                     console.log(video)
                  setStoppedUser(stoppedUser.filter((e)=> !stoppedUser.includes(obj.id)))
                }
            })
          
        }
    }, [stoppedUser])


    const leaveMeeting = useCallback(()=>{

           

        navigate("/dashboard",{state:{}})

    },[])



    return (
        <div id="main-video-window">


            {(screenStatus || otherScreenState)?
                <div >

                    <VideoComponent classStyle="screen-share" key={screenData.id} id={screenData.id} stream={screenData.stream} muted={screenData.muted} />

                </div>
                : null}

                <div id="video-place"  className={(screenStatus||otherScreenState)?"nodisplay" : ""} >
                    {videoStatus ?
                    <>   
                        <VideoComponent id={myVideoData.id} stream={myVideoData.stream} muted={myVideoData.muted} classStyle="video-container"  />
                    </>
                      
                        : null}
                   {(videoData.map((e) => (
                        <VideoComponent key={e.id} id={e.id} stream={e.stream} muted={e.muted}  classStyle="video-container" />
                    )))}
                </div>
            




            <div id="meeting-control">
            <div>
                    
                    <span className='meeting-text margin-left1' onClick={muteUnmute}>
                    {audioStatus ?  <MdMic  size="1.2em"/>:  <MdMicOff  size="1.2em"/>}</span>
                    <span className='meeting-text margin-left1' onClick={(screenStatus) ? () => { } : startStopVideo}>{videoStatus ?<BsCameraVideoFill size="1.2em"/> : <BsFillCameraVideoOffFill size="1.2em"/>}</span>
                </div>
                <div > <span className='meeting-text ' onClick={startScreenShare}>
                    {!screenStatus ? <MdScreenShare size="1.2em"/> : <MdStopScreenShare size="1.2em"/>}</span></div>
                <div><span className='meeting-text margin-left1 text-danger' onClick={leaveMeeting}>Leave</span></div>
            </div>
        
        </div>
    )
}

export default Video