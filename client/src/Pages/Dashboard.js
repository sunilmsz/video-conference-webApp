import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from "react-router-dom"

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [allowed, setAllowed] = useState(false)
  const [meetLink, setMeetLink] = useState("")
  const [inviteCode, setInviteCode] = useState("")
  const [disabled, setDisabled] = useState(false)
  const [roomId,setRoomId]= useState("")

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

    const options = {
      method: "post",
      url: "https://mern-meet-up.herokuapp.com/api/users/dashboard/getRoomId",
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json'
      },
      withCredentials: true
    }
    axios(options)
      .then((response) => {
        setMeetLink(`https://mern-meet-up.herokuapp.com/video/${response.data.data._id}`)
        setInviteCode(response.data.data.code)
        setRoomId(response.data.data._id)
      })
      .catch((error) => {
        const errMsg = error.response?.data?.msg || " Some thing went wrong, please try again later"
        alert(errMsg)
      })
  }



  const startVideo = () => {
   navigate("/video/"+roomId)
  }


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
              <button className="btn btn-primary">Join Meeting</button>
              <button className="btn btn-primary">LogOut</button>
            </div>

            {
              meetLink === "" ? <></> : <div>
                <p className='text-dark'>Meeting Link:- {meetLink}
                  <br /> Invite Code :- {inviteCode}
                  <br />
                  <small id="emailHelp" className="form-text text-muted  ">you can share this link or invite code to other users to join your meeting.</small>
                </p>
                <button className="btn btn-primary " onClick={() => startVideo()}>Start Meeting</button>
              </div>
            }

          </div>
        </div>
      </>
    )


}

export default Dashboard