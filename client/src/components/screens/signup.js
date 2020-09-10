import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css'
  
const SignUp = () => {
    const history = useHistory()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const postData = () => {
        // eslint-disable-next-line
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/    
        //Email validation   
        if (!regex.test(email)){
            M.toast({html:"Invalid Email", classes:"toastClass toastError", displayLength:"1500"})
            return
        }
        fetch('/signup', {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                email,
                password
            })
        })
        .then( res => res.json())
        .then( data =>{
            if(data.error){
                console.log(data.error)
                M.toast({html:data.error, classes:"toastClass toastError", displayLength:"1500"})
                return
            }else{
                console.log("Success", data, data.msg)
                M.toast({html:data.msg, classes:"toastClass toastSuccess", displayLength:"1500"})             
                history.push('/signin')     
            }
        })
        .catch( err => console.log("Error...", err))
    }

    return (
        <div className="card border-primary mb-3 auth-card" style={{maxWidth: "375px",borderTopWidth: "7px"}}>
            <div className="card-header">Fellow Tripper</div>
            <div className="card-body text-primary">
                <i className="fas fa-user fa-md ml-1 toInline"></i>
                <input 
                    className="inp ml-1 toInline" 
                    placeholder="Name" 
                    style={{width: "311px"}}
                    type="text" 
                    onChange = { e => setName(e.target.value)}
                    value={name}
                /><br />              
                
                <i className="fas fa-envelope fa-sm ml-1 toInline"></i>
                <input 
                    className="inp ml-1 toInline" 
                    placeholder="Email" 
                    style={{width: "311px"}}
                    type="text" 
                    onChange = { e => setEmail(e.target.value)}
                    value={email}
                /><br />              
                
                <i className="fas fa-lock fa-sm ml-1 toInline"></i>
                <input
                    className="inp ml-1 toInline" 
                    placeholder="Password" 
                    style={{width: "311px"}}
                    type="password" 
                    onChange = { e => setPassword(e.target.value)}
                    value={password}
                /><br />
                
                <Link to="/signin">Already have an account?</Link><br />
                
                <button 
                    className="btn btn-sm mt-3 mb-1 btn-primary float-right" 
                    style={{borderRadius:"0"}}
                    onClick={() => postData()}
                >Sign Up</button>
            </div>
        </div>
    )
}

export default SignUp