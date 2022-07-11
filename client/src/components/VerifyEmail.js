import React, { useEffect } from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import axios from 'axios'
const VerifyEmail = () => {

    const {userId,randomSt} = useParams()
    const navigate = useNavigate();

    const options = {
        method: "get",
        url: `https://mern-meet-up.herokuapp.com/${userId}/users/ev/${randomSt}`,
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json',
          Authorization: 'Bearer '
        }
      }

    useEffect(()=> {

        const response =  axios(options)
        .then((response)=> {
            alert(response.data.data)
            navigate("/")
        })
        .catch((error)=>{
            alert("The link has been expired")
            navigate("/")
        })
  

    },[])

    
   

  return (
    <div></div>
  )
}

export default VerifyEmail