import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import axios from "axios"

const LogIn = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const [loadingStatus, setLoadingStatus] = useState(false)

  const submitForm = (e) => {
    e.preventDefault()

    if (email == "" || password == "")
      return alert("Enter Email & password")
      setLoadingStatus(true)
    const options = {
      method: "post",
      url: "/api/users/login",
      data: ({
        email: email,
        password: password
      }),
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json',
        Authorization: 'Bearer'
      }
    }
    //axios.defaults.withCredentials = true
    const response = axios(options)
      .then((response) => {
        const data = response.data
        if (data.msg == "Success") {
          setLoadingStatus(false)
          navigate("/dashboard",{state:data.data})
        }

      })
      .catch((error) => {
        setLoadingStatus(false)
        alert(error.response.data.msg)
      })


  }

  return (

    <div className='parent-to-center' >
      <div className='child-to-center'>
        <form action="" onSubmit={(e) => submitForm(e)}>
          <div className="form-group">

            <input type="email" className="form-control form-items-mar" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />

          </div>
          <div className="form-group">

            <input type="password" className="form-control form-items-mar" id="exampleInputPassword1" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {loadingStatus ?
            (<button className="btn btn-primary" type="button" disabled>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            </button>) :
            (<button type="submit" className="btn btn-primary">Login</button>)}
  <div className="d-flex  mt-4  flex-column">
<span className=' mb-4'>  <small id="emailHelp" className="form-text text-muted  ">Don't have an account?.<span className=" btn-secondary p-2 rounded cursor-pointer-mode" onClick={(e) => { navigate("/register") }}>Register</span></small></span>
<span className='  mb-2'>  <small id="emailHelp" className="form-text text-muted  ">Forgot password?.<span className=" btn-secondary p-2 rounded cursor-pointer-mode" onClick={(e) => { navigate("/user/forgotPassword") }}>Reset Password</span></small></span>
</div>
        </form>
      </div>
    </div>

  )
}

export default LogIn