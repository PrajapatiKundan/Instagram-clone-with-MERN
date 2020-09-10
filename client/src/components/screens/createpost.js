import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { CLOUD_NAME, CLOUD_URL_FOR_IMAGE, UPLOAD_PRESET} from '../../keys/keys_and_url'

const CreatePost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    
    useEffect(() => {
        if(url){
            //post request to the server
            fetch('/createpost',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+ localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    pic:url
                })
            })
            .then( res => res.json())
            .then( data => {
                if(data.error){
                    M.toast({html:data.error, classes:"toastClass toastError", displayLength:"1500"})
                    return
                }else{
                    M.toast({html:"post created successfully", classes:"toastClass toastSuccess", displayLength:"1500"})
                    history.push('/')
                }
            })
            .catch( err => console.log("Error...", err))
        }
        // eslint-disable-next-line
    }, [url])

    const postData = () => {
        const data = new FormData()
        data.append("file", image)
        //details of cloudinary cloud services
        data.append("upload_preset", UPLOAD_PRESET)
        data.append("cloud_name", CLOUD_NAME)

        //uploading image to cloudinary
        fetch(CLOUD_URL_FOR_IMAGE, {
            method:"post",
            body:data
        })
        .then( res => res.json())
        .then( data => { setUrl(data.url) })
        .catch( err => console.log(err))
    }

    return (
        <div className="card" style={{ margin:"26px auto", maxWidth:"400px"}}>
            <div className="card-header">Create Post</div>
            <div style={{ margin: "26px auto"}}>
                <input 
                    className="inp ml-1" 
                    type="text" 
                    style={{ width: "370px"}} 
                    placeholder="title"
                    value={title}
                    onChange={ e => setTitle(e.target.value)}    
                /><br />
                <input 
                    className="inp ml-1" 
                    type="text" 
                    style={{ width: "370px"}} 
                    placeholder="body"
                    value={body}
                    onChange={ e => setBody(e.target.value)}    
                /><br />
            </div>
            <span className="btn btn-secondary btn-sm ml-3 mr-3 btn-file">
                <i className="fa fa-cloud-upload-alt"></i> Upload Image
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={ e => setImage(e.target.files[0])}    
                />
            </span>
            {   image ? <p style={{color:"#95389e", margin:"5px auto 0px"}}>{image.name}</p>:<p></p>  }
            <button 
                className="btn btn-sm btn-primary" 
                style={{width: "20%", margin: "10px auto 15px"}}
                onClick={ () => postData() }    
            > Submit </button>
        </div>
    )
}

export default CreatePost