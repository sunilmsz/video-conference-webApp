import React,{useRef, useState,useEffect,memo} from 'react'

const Video = ({id,stream,muted,classStyle}) => {

    const vidRef = useRef();
   

 useEffect( () => {
    vidRef.current.srcObject = stream;
    vidRef.current.addEventListener('loadedmetadata', () => {
        vidRef.current.play()
    })  
    vidRef.current.muted = muted? true :false
    vidRef.current.classList.add(classStyle) // "video-container"

 },[])

  return (
    <div>
<video id={id} ref={vidRef} poster={"/images/user.png"}> </video>
    </div>
  )
}

export default memo(Video)