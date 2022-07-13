import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const ForgotPassword = () => {

    const [email,setEmail] = useState();
    const [loadingStatus,setLoadingStatus]= useState();
    const navigate = useNavigate();

    const submitForm = e=> {
            e.preventDefault()
            setLoadingStatus(true)
            const options = {
                method: "post",
                url: `/api/users/resetPasswordLink`, 
                data:{
                    email:email
                },
                headers: {
                  "Content-Type": "application/json",
                  'Accept': 'application/json',
                }
              }
        
   
        
                const response =  axios(options)
                .then((response)=> {
                    setLoadingStatus(false)
                    alert(response.data.data)
                    navigate("/")
                })
                .catch((error)=>{
                    setLoadingStatus(false)
                    console.log(error)
                    alert(error.response.data.msg)
                })

    }

    return (
        <div className='parent-to-center' >
            <div className='child-to-center'>
                <form action="" onSubmit={(e) => submitForm(e)}>
                    <div className="form-group">

                        <input type="email" className="form-control form-items-mar" id="exampleInputEmail1" required aria-describedby="emailHelp" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />

                    </div>
                    {(loadingStatus) ?
                        (<button className="btn btn-primary" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        </button>) :
                        (<button type="submit" className="btn btn-primary">Continue</button>)}
          
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword