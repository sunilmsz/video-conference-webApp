
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