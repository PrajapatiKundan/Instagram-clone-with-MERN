import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../App'

const SignIn = () => {
    const { state, dispatch } = useContext(UserContext)
    
    const history = useHistory()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const postData = () => {
        // eslint-disable-next-line
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/       
        if (!regex.test(email)){
            M.toast({html:"Invalid Email", classes:"toastClass toastError", displayLength:"2000"})
            return
        }
        fetch('/signin',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        })
        .then( res => res.json())
        .then( data => {
            console.log("Data : ", data)
            if(data.error){
                M.toast({html:data.error, classes:"toastClass toastError", displayLength:"1500"})
                return
            }else{
                localStorage.setItem("jwt", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))//{_id name email}
                dispatch({
                    type:"USER",//actiontype
                    payload:data.user //payload information for action
                })
                M.toast({html:"Signed in successfully", classes:"toastClass toastSuccess", displayLength:"1500"})
                history.push('/')
            }
        })
        .catch( err => console.log("Error...", err))
    }

    return (
        <div className="card border-primary mb-3 auth-card" style={{maxWidth: "375px",borderTopWidth: "7px"}}>
            <div className="card-header">Fellow Tripper</div>
            <div className="card-body text-primary">
                <i className="fas fa-envelope fa-sm ml-1 toInline"></i>
                <input 
                    className="inp ml-1 toInline" 
                    type="text" 
                    placeholder="Email" 
                    style={{width: "311px"}}
                    value={email}
                    onChange={ e => setEmail(e.target.value)}
                /><br />              
                <i className="fas fa-lock fa-sm ml-1 toInline"></i>
                <input 
                    className="inp ml-1 toInline" 
                    type="password" 
                    placeholder="Password" 
                    style={{width: "311px"}}
                    value={password}
                    onChange={ e => setPassword(e.target.value)}
                /><br />

                <Link to="/signup">Don't have an account?</Link><br/>
                <button 
                    className="btn btn-sm mt-3 mb-1 btn-primary float-right" 
                    style={{borderRadius:"0"}}
                    onClick={ () => postData() }    
                >Login</button>              
            </div>
        </div>
    )
}

export default SignIn