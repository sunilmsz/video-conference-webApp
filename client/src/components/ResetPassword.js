import React, { useState,useEffect } from 'react'
import axios from 'axios'
import { useParams ,useNavigate} from 'react-router-dom'

const ResetPassword = () => {
    const { userId, randomSt } = useParams()
    const [allowed, setAllowed] = useState(false)
    const [password,setPassword] = useState("")
    const [cPassword,setCPassword] = useState("")
    const [loadingStatus,setLoadingStatus] = useState(false)
    const navigate = useNavigate()

    useEffect(()=> {
        const options = {
            method: "get",
            url: `/api/${userId}/users/isvrpl/${randomSt}`,
            headers: {
              "Content-Type": "application/json",
              'Accept': 'application/json',
            },
            withCredentials: true
          }
            const response =  axios(options)
            .then((response)=> {
                setAllowed(true)
            })
            .catch((error)=> {
                const errMsg = error.response?.data?.msg || "Invalid Link"
                alert(errMsg)
                navigate("/")

            })
    },[])
    

    const submitForm = e=> {
            e.preventDefault()
            if(password!==cPassword)
            return alert("Entered password does not match")

            setLoadingStatus(true)
                
            const options = {
                method: "post",
                url: `/api/${userId}/users/rp/${randomSt}`,
                data:{
                    password
                },
                headers: {
                  "Content-Type": "application/json",
                  'Accept': 'application/json',
                },
                withCredentials: true
              }
                const response =  axios(options)
                .then((response)=> {
                    setLoadingStatus(false)
                    alert("password changed Successfully")
                    navigate("/")
                })
                .catch((error)=> {
                    const errMsg = error.response?.data?.msg || "this link is expired"
                    alert(errMsg)
                    navigate("/")
                })

    }

    return (<>
        {(!allowed) ? <></> :

            <div className='parent-to-center' >
                <div className='child-to-center'>
                    <form action="" onSubmit={(e) => submitForm(e)}>
                        <div className="form-group">

                            <input type="password" className="form-control form-items-mar" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />

                        </div>
                        <div className="form-group">

                            <input type="password" className="form-control form-items-mar" id="exampleInputPassword1" placeholder="Re-enter Password" value={cPassword} onChange={(e) => setCPassword(e.target.value)} />
                        </div>
                        {loadingStatus ?
                            (<button className="btn btn-primary" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            </button>) :
                            (<button type="submit" className="btn btn-primary">Change Password</button>)}
                    </form>
                </div>
            </div>

        }
    </>
    )
}

export default ResetPassword