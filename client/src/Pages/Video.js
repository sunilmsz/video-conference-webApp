import React, { useEffect, useState, useRef } from 'react'
import { io } from "socket.io-client"
import Peer from 'peerjs';
import { useParams} from 'react-router-dom';

const Video = () => {

    const {roomId} = useParams();
    
    const myVideo = document.createElement('video')
    myVideo.muted = true;
     

    let myStream = useRef();
    
   
    useEffect(()=> {
        const socket = io("http://localhost:3001");
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
        .then(stream => {
            myStream.current = stream;
            addVideoStream(myVideo, stream,socket.id) 

            const peer = new Peer(undefined, { path: "/peerjs", host: "/", port: "3001" })
            peer.on("open", id => {
                socket.emit("nuser-joined", roomId, id)
            })
    
            socket.on("user-connected", (peerId,socket_id) => { 

                console.log("user-connnected")

                const call = peer.call(peerId, stream,{metadata:{socket_id:socket.id}})
                const newVideo = document.createElement('video')
                call.on("stream", userVideoStream => {
                    console.log("call made time")
                    addVideoStream(newVideo, userVideoStream,socket_id)
                })
            })
    
            peer.on('call', function (call) {
                call.answer(stream);
                const newVideo = document.createElement("video")
                call.on('stream', function (remoteStream) {
                    console.log("call recieving time")
                    console.log(call.metadata.socket_id,socket.id)
                    addVideoStream(newVideo, remoteStream,call.metadata.socket_id)
                })
            })

            socket.on("user-disconnected",(sId)=> {
                console.log(sId,"it is disconnected")
        })
         
        })
       
        return ()=> {
            myStream.current.getVideoTracks()[0].stop()
            myStream.current.getAudioTracks()[0].stop()
            socket.disconnect()     
            console.log("called")    
        }
    

    },[])

      





    function addVideoStream(video, stream,socket_id) {
        let root = document.getElementById("video-place")
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        video.setAttribute("id",socket_id)
        video.classList.add("video-container")
        root.append(video);
    }

    return (
        <div id="video-place" ></div>
    )
}

export default Video