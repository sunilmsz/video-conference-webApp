import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from "react-router-dom"

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [allowed, setAllowed] = useState(false)
  const [meetLink, setMeetLink] = useState("")
  const [inviteCode, setInviteCode] = useState("")
  const [jInviteCode,setjInviteCode] = useState("")
  const [disabled, setDisabled] = useState(false)
  const [roomId,setRoomId]= useState("")
  const [showMeetLink,setShowMeetLink] = useState(false)
  const [showJoinMeet,setShowJoinMeet] = useState(false)
 

  //   const callLogin = async () => {
  //     try {
  //       const options = {
  //         method: "post",
  //         url: "http://localhost:3001/users/dashboard",
  //         headers: {
  //           "Content-Type": "application/json",
  //           'Accept': 'application/json'
  //         },
  //         withCredentials: true
  //       }
  //       const response = await axios(options)
  //       const data = response.data
  //       console.log(data)
  //       if (data.msg === "Success")
  //         setAllowed(true)
  //     }
  //     catch (error) {
  //       if (error.response.data.msg != "Success") {
  //         navigate("/")
  //       }
  //     }
  //   }


  useEffect(() => {
    if (!location.state)
      navigate("/")


  }, [])

  const getRoomId = (e) => {

    if(meetLink){
      setShowMeetLink(true)
      setShowJoinMeet(false)
      return
    }

    const options = {
      method: "post",
      url: "/api/users/dashboard/getRoomId",
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json'
      }
    }
    axios(options)
      .then((response) => {
        setMeetLink(`https://mern-meet-up.herokuapp.com//video/${response.data.data._id}`)
        setInviteCode(response.data.data.code)
        setRoomId(response.data.data._id)
        setShowMeetLink(true)
      })
      .catch((error) => {
        const errMsg = error.response?.data?.msg || " Some thing went wrong, please try again later"
        alert(errMsg)
      })
  }


  const joinMeeting  = ()=> {

    if(jInviteCode.length!=8)
    {
      alert("invite code should be  8 digit long")
      return
    }

    const options = {
      method: "post",
      url: "/api/users/dashboard/getRoomIdByCode",
      data:{
        code:jInviteCode
    },
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json'
      }
    }
    axios(options)
      .then((response) => {
        navigate("/video/"+ response.data.data)
       
      })
      .catch((error) => {
        const errMsg = error.response?.data?.msg || " Some thing went wrong, please try again later"
        alert(errMsg)
      })


  }

  


  const startVideo = useCallback(() => {
   navigate("/video/"+roomId)
  },[roomId])


  if (!location.state) {
    <></>
  }
  else

    return (
      <>
        <div className='parent-to-center' >
          <div className='child-to-center  '>
            <div className='d-flex justify-content-around mt-3 mb-3'>
              <button className="btn btn-primary " onClick={(e) => getRoomId(e)}>New Meeting</button>
              <button className="btn btn-primary"  onClick = {(e)=> 
              {
                setShowMeetLink(false)
                setShowJoinMeet(true)
              }}>Join Meeting</button>
              <button className="btn btn-primary">LogOut</button>
            </div>

            {
              !showMeetLink? <></> : <div>
                <p className='text-dark'>Meeting Link:- {meetLink}
                  <br /> Invite Code :- {inviteCode}
                  <br />
                  <small id="emailHelp" className="form-text text-muted  ">you can share this link or invite code to other users to join your meeting.</small>
                </p>
                <button className="btn btn-primary " onClick={() => startVideo()}>Start Meeting</button>
              </div>
            }

{
              !showJoinMeet? <></> : <div>
                <input type="text" className="form-control form-items-mar" id="invitecode" placeholder="Enter InviteCode" value={jInviteCode} onChange={(e) => setjInviteCode(e.target.value)} />
                <button className="btn btn-primary " onClick={() => joinMeeting()}>Join Meeting</button>
              </div>
            }

          </div>
        </div>
      </>
    )


}

export default Dashboard