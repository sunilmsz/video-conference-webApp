import React, { useEffect, useState, useRef } from 'react'
import { io } from "socket.io-client"
import Peer from 'peerjs';
import { useParams } from 'react-router-dom';
import { default as VideoComponent } from '../components/Video';
import { v4 as uuidV4 } from 'uuid';

const Screenshare = () => {

    const { roomId } = useParams();
    const [videoData, setVideoData] = useState([])
    const [streamData, setStreamData] = useState([])
    const [disconnectedId,setDisconnectedId] = useState([])

    useEffect(() => {
        const socket = io("https://mern-meet-up.herokuapp.com/");

        navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
        }).then((stream) => {
            setVideoData([...videoData, { id: socket.id, stream: stream, muted: true }])

            const peer = new Peer(uuidV4(), { path: "/peerjs", host: "/" })
            peer.on("open", id => {
                socket.emit("nuser-joined", roomId, id)
            })

            socket.on("user-connected", (peerId, socket_id) => {
                const call = peer.call(peerId, stream, { metadata: { sId: socket.id } })

                call.on("stream", userVideoStream => {
                    setStreamData((data) => [...data, { stream: userVideoStream, socket_id:socket_id }])
                })
            })

            peer.on('call', function (call) {
                call.answer(stream);
                call.on('stream', function (remoteStream) {
                    setStreamData((data) => [...data, { stream: remoteStream, socket_id: call.metadata.sId }])
                })
            })

            socket.on("user-disconnected",(id)=> {
                setDisconnectedId((data)=> [...data, id])
            })

        })



        return ()=> {
        // videoData[0].getVideoTracks()[0].stop()
        //     videoData[0].getAudioTracks()[0].stop()
           socket.disconnect()     
        }


    }, [])
    
    useEffect(() => {
        console.log(streamData)
        if (streamData.length > 0) {
            console.log(streamData,"streamData")
            const arr = videoData.map(e => e.id)
            for (let i = 0; i < streamData.length; i++) {
                if (!arr.includes(streamData[i].socket_id))
                {
                    setVideoData((videoData) => [...videoData, { id: streamData[i].socket_id, stream: streamData[i].stream, muted: false }])
                    arr.push(streamData[i].socket_id)
                }              
            }
        }
    }, [streamData])

    useEffect(() => {
        console.log(videoData, " videoData")

    }, [videoData])

    useEffect(()=> {
        if(disconnectedId.length>0)
        {       console.log("removing element executed")
            setVideoData(videoData.filter((e)=> !disconnectedId.includes(e.id)))
            setStreamData(streamData.filter((e)=> !disconnectedId.includes(e.socket_id)))
        }
    },[disconnectedId])



    return (
        <div id="video-place" >

            {videoData.length > 0 ? (videoData.map((e) => (
                <VideoComponent key={e.id} id={e.id} stream={e.stream} muted={e.muted} classStyle="screen-share" />
            ))) : <></>}

        </div>
    )
}

export default Screenshare