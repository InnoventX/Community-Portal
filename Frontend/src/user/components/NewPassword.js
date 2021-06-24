import React,{useState,useContext,} from 'react'
import {Link,useHistory,useParams} from 'react-router-dom'
import M from 'materialize-css'
const NewPassword  = ()=>{
    const history = useHistory()
    const [password,setPassword] = useState("")
    const {token} = useParams()
    console.log(token)
    const PostData = ()=>{
        fetch(`${process.env.REACT_APP_BACKEND_URL}/user/new-password`,{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token
            })
        }).then(res=>res.json())
            .then(data=>{
                console.log(data)
                if(data.error){
                    M.toast({html: data.error,classes:"#c62828 red darken-3"})
                }
                else{

                    M.toast({html:data.message,classes:"#43a047 green darken-1"})
                    history.push('/authenticate')
                }
            }).catch(err=>{
            console.log(err)
        })
    }
    return (
        <div>
            <div>
                <h2>New Password</h2>

                <input
                    type="password"
                    style={{
                        color: "black"
                    }}
                    placeholder="enter a new password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <button
                        onClick={()=>PostData()}
                >
                    Update password
                </button>

            </div>
        </div>
    )
}

export default NewPassword;