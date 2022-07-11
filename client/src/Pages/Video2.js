import React, { useEffect, useState, useRef } from 'react'
import { io } from "socket.io-client"
import Peer from 'peerjs';
import { useParams } from 'react-router-dom';
import { default as VideoComponent } from '../components/Video';
import { v4 as uuidV4 } from 'uuid';


const Video = () => {

    const { roomId } = useParams();
    const [videoData, setVideoData] = useState([])
    const [streamData, setStreamData] = useState([])
    const [disconnectedId, setDisconnectedId] = useState([])
    const [screenData, setScreenData] = useState({})
    const [screenStatus, setScreenStatus] = useState(false)
    const [videoStatus, setVideoStatus] = useState(false)
    const [audioStatus, setAudioStatus] = useState(false)
    const [myVideoData, setMyVideoData] = useState({})
    const socketRef = useRef();
    const [stoppedUser, setStoppedUser] = useState([])
    const [reStartedUser,setRestartedUser] = useState([])
    const caller = useRef()
    const reciever = useRef()

    useEffect(() => {
        const socket = (io("http://localhost:3001"))


        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then((stream) => {
            socketRef.current = socket;
            caller.current= []
            reciever.current= []
            //     stream.getAudioTracks()[0].enabled == false;
            setMyVideoData({ id: socket.id, stream: stream, muted: true, nodisplay: false })
            
            setVideoStatus(true);
            setAudioStatus(true)
            // setVideoData([...videoData, { id: socket.id, stream: stream, muted: true }])
            console.log(stream.getVideoTracks(), "streamObject")
            console.log(stream.getAudioTracks(), "streamObject")
            const peer = new Peer(uuidV4(), { path: "/peerjs", host: "/", port: "3001" })
            peer.on("open", id => {
                socket.emit("nuser-joined", roomId, id)
            })

            socket.on("user-connected", (peerId, socket_id) => {
                const call = peer.call(peerId, stream, { metadata: { sId: socket.id } })
                caller.current.push(call)
                // setTimeout(()=> {
                //     console.log(caller.current[0].peerConnection.getSenders(),"caller list")
                // },5000)
               
                call.on("stream", userVideoStream => {
                    console.log(call.peerConnection.getSenders(),"calling time")
                    setStreamData((data) => [...data, { stream: userVideoStream, socket_id: socket_id, nodisplay: false }])
                })
            })

            peer.on('call', function (call) {
                call.answer(stream);
                reciever.current.push(call)
               // console.log(reciever.current[0].peerConnection.getSenders(),"reciever List")
                call.on('stream', function (remoteStream) {
                    console.log(call.peerConnection.getSenders(),"Answering time")
                    setStreamData((data) => [...data, { stream: remoteStream, socket_id: call.metadata.sId, nodisplay: false }])
                })
            })

            socket.on("user-video-stopped", (socket_id) => {
                setStoppedUser([...stoppedUser, socket_id])
            }
            )

            socket.on("user-restarted-video",(socket_id)=> {
                   // setRestartedUser([...reStartedUser,socket_id])
                
                  
            })

            socket.on("user-disconnected", (id) => {
                setDisconnectedId((data) => [...data, id])
            })

        }).catch((error) => { })



        // return () => {
        //     myVideoData.stream?.getVideoTracks()[0].stop()
        //     myVideoData.stream?.getAudioTracks()[0].stop()
        //     socket.disconnect()
        // }


    }, [])

    useEffect(() => {
        console.log(streamData)
        if (streamData.length > 0) {
            console.log(streamData, "streamData")
            const arr = videoData.map(e => e.id)
            for (let i = 0; i < streamData.length; i++) {
                if (!arr.includes(streamData[i].socket_id)) {
                    setVideoData((videoData) => [...videoData, { id: streamData[i].socket_id, stream: streamData[i].stream, muted: false, nodisplay: false }])
                    arr.push(streamData[i].socket_id)
                }
            }
        }
    }, [streamData])


    const startStopVideo = () => {

        if (videoStatus) {
            myVideoData.stream.getVideoTracks()[0].stop()
            setVideoStatus(false)
            console.log(myVideoData.stream, "after stopping video")
           
            socketRef.current.emit("user-video-stopped")
  
        }
        else {
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then((stream) => {
                //debugger;
                stream.getAudioTracks()[0].enabled=audioStatus
                setMyVideoData({ id: socketRef.current.id, stream:stream, muted: true, nodisplay: false })
                setVideoStatus(true)
                socketRef.current.emit("user-restarted-video")
                if(caller.current.length>0)
                {
                    console.log(caller.current,"caller details")
                    console.log(caller.current[0].peerConnection.getSenders(),"caller sender object")
                    
                }
              if(reciever.current.length>0)
              {
                console.log(reciever.current,"reciever details")
                console.log(reciever.current[0].peerConnection.getSenders(),"reciever  sender object")
              }
             
            

               // for(let i=0;i<caller.current.length;i++)
                {
                    if(caller.current.length>0)
                    {
                        caller.current[0].peerConnection.getSenders()[0].replaceTrack(stream.getAudioTracks()[0])
                        caller.current[0].peerConnection.getSenders()[1].replaceTrack(stream.getVideoTracks()[0])
                       

                    }
                    if(reciever.current.length>0)
                    {
                        
                reciever.current[0].peerConnection.getSenders()[0].replaceTrack(stream.getAudioTracks()[0])
                reciever.current[0].peerConnection.getSenders()[1].replaceTrack(stream.getVideoTracks()[0])

                    }

                }
            })

        }

    }


    const muteUnmute = () => {
        if (audioStatus) {
            myVideoData.stream.getAudioTracks()[0].enabled = false;
            setAudioStatus(false)
            console.log("after muting", myVideoData.stream)
        }
        else {
            myVideoData.stream.getAudioTracks()[0].enabled = true;
            setAudioStatus(true)
        }
    }

    const startScreenShare = () => {

        //socket.emit("screenShared",socket.id)
        if (!screenStatus) {
            navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            }).then((stream) => {
                setScreenData({ id: 1, stream: stream })
                setScreenStatus(true)
                stream.getVideoTracks()[0].addEventListener('ended', () => setScreenStatus(false))
            }).catch((error) => { })
        }

        else {
            setScreenStatus(false)
        }


    }

    useEffect(() => {
        console.log(videoData, " videoData")

    }, [videoData])
    useEffect(() => {
        console.log(myVideoData, " videoData")

    }, [myVideoData])

    useEffect(() => {
        if (disconnectedId.length > 0) {
            console.log("removing element executed")
            setVideoData(videoData.filter((e) => !disconnectedId.includes(e.id)))
            setStreamData(streamData.filter((e) => !disconnectedId.includes(e.socket_id)))
        }
    }, [disconnectedId])

    useEffect(() => {
        console.log(screenData)
    }, [screenData])

    useEffect(() => {
        console.log(stoppedUser)
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


    // useEffect(()=> {
    //     if(reStartedUser.length>0)
    //     {
    //         setVideoData(videoData.map((e)=> {
    //             if(reStartedUser.includes(e.id))
    //             {
    //                 e.stream
    //             }
    //         }))
    //     }
    // },[reStartedUser])


    return (
        <div id="main-video-window">


            {screenStatus ?
                <div >

                    <VideoComponent classStyle="screen-share" key={screenData.id} id={screenData.id} stream={screenData.stream} muted={screenData.muted} />

                </div>
                :

                <div id="video-place" >
                    {videoStatus ?
                        <VideoComponent id={myVideoData.id} stream={myVideoData.stream} muted={myVideoData.muted} classStyle="video-container" />
                        : null}
                   {(videoData.map((e) => (
                        <VideoComponent key={e.id} id={e.id} stream={e.stream} muted={e.muted}  classStyle="video-container" />
                    )))}
                </div>
            }




            <div id="meeting-control">
                <div>
                    <span className='meeting-text margin-left1' onClick={muteUnmute}>{!audioStatus ? "UnMute" : "Mute"}</span>
                    <span className='meeting-text margin-left1' onClick={startStopVideo}>{!videoStatus ? "Start Video" : "Stop Video"}</span>
                </div>
                <div > <span className='meeting-text ' onClick={startScreenShare}>{!screenStatus ? "Share Screen" : "Stop Screen Share"}</span></div>
                <div><span className='meeting-text margin-left1 text-danger'>Leave Meeting</span></div>
            </div>
        </div>
    )
}

export default Video