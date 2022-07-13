import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loadingStatus, setLoadingStatus] = useState(false)

    const register = async (e) => {
        try {
            e.preventDefault();
            if ((email.trim() == "" || password == "" || name.trim() == ""))
                return
            setLoadingStatus(true)
            const options = {
                method: "post",
                url: "/api/users/register",
                data: ({
                    email: email,
                    password: password,
                    name: name
                }),
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                    Authorization: 'Bearer '
                },
                withCredentials: true
            }
            //axios.defaults.withCredentials = true
            const response = await axios(options)
            const data = response.data

            if (data.msg == "Success")
            {   setLoadingStatus(false)
                alert(data.data)
                navigate("/")
            }
               
        }
        catch (error) {
            console.log(error)
            setLoadingStatus(false)
            alert(error.response.data.msg)
        }
    }

    return (
        <div className='parent-to-center ' >
            <div className='child-to-center'>
                <form action="" onSubmit={(e) => { register(e) }}>
                    <div className="form-group">

                        <input type="text" className="form-control form-items-mar" id="name" aria-describedby="emailHelp" placeholder="Enter Full Name" autoComplete='off' required value={name} onChange={(e) => { setName(e.target.value) }} />

                    </div>
                    <div className="form-group">

                        <input type="email" className="form-control form-items-mar" id="email" aria-describedby="emailHelp" placeholder="Enter email" autoComplete='off' requiredvalue={email} onChange={(e) => { setEmail(e.target.value) }} />
                    </div>
                    <div className="form-group">

                        <input type="password" className="form-control form-items-mar" id="password" placeholder="Enter Password" autoComplete='off' required value={password} onChange={(e) => { setPassword(e.target.value) }} />
                    </div>
                    {/* <div className="form-group form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                </div> */}
           { (loadingStatus==false)? 
                   ( <span className='text-center d-block mb-3'> <button type="submit" className="btn btn-primary ">Register</button></span>)
                   : 
                    
                    <button className="btn btn-primary" type="button" disabled>
  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  <span className="visually-hidden">Loading...</span> 
</button> }
                    <span className='d-block text-right mt-5 mb-3'>  <small id="emailHelp" className="form-text text-muted  register-to-login-btn ">Already have an account?.<span className=" btn-secondary p-2 rounded cursor-pointer-mode" onClick={(e) => { navigate("/") }}>Login</span></small></span>
                </form>
            </div>
        </div>
    )
}

export default Register