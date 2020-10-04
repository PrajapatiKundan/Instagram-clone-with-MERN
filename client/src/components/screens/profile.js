import React, {useEffect, useState, useContext} from 'react';
import {UserContext} from '../../App'
import { CLOUD_NAME, CLOUD_URL_FOR_IMAGE, UPLOAD_PRESET} from '../../keys/keys_and_url'

const Profile = () => {
    const [mypics, setMypics] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [image, setImage] = useState("")
    //const [currentImg, setCurrentImage] = useState("")
    const [url, setUrl] = useState("")

    useEffect(() => {
        fetch('/mypost', {
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            setMypics(result.myposts)
        })

    },[])


    useEffect(() => {
        if(url){
            //post request to the server
            fetch('/changeprofile',{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+ localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    picUrl:url
                })
            })
            .then( res => res.json())
            .then( data => {
                
                localStorage.setItem("user",JSON.stringify({
                    ...state,
                    profile_pic: data.profile_pic
                }))
                dispatch({
                    type:"UPDATEPROFILE",
                    payload:data.profile_pic
                })
            })
            .catch( err => console.log("Error...", err))
        }
        // eslint-disable-next-line
    }, [url])
    const genImgUrl = () => {
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
        .then( data => { 
            setUrl(data.url) 
        })
        .catch( err => console.log(err))
        setImage("")
    }

    return (
        
        <div style={{ maxWidth:"550px", margin:"0px auto"}}>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "18px 0",
                borderBottom: "1px solid grey",
                height: "205px"
            }}>
                <div>
                    <img 
                        style={{width:"160px", height:"160px", borderRadius:"80px"}}
                        src={state ? state.profile_pic : "loading..."}
                        alt="No profile"
                    />
                    
                </div>
                <div>
                    <div style={{margin:"22% 0"}}>
                        <h4>{state ? state.name:"loading"}</h4>
                        
                        <div style={{ display:"flex", justifyContent:"space-between", width:"108%"}}>
                            <h6>{mypics.length} posts</h6>
                            <h6>{state ? state.followers.length : "..."} followers</h6>
                            <h6>{state ? state.following.length : "..."} followings</h6>
                        </div>
                        <div style={{position:"relative"}}>
                        {
                        image
                        ?
                        <button 
                        className="btn btn-outline-secondary btn-sm ml-3 mr-3 btn-file profile-btn "
                        onClick={ () => genImgUrl() }  
                        title= {image.name} 
                        > Save profile</button>
                        :
                        <span className="btn btn-outline-secondary btn-sm ml-3 mr-3 btn-file profile-btn">
                            Edit profile
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={ e => setImage(e.target.files[0])}    
                            />
                        </span>
                        }
                        </div>
                    </div>

                </div>
            </div>
            <div className="gallery">
                {
                    mypics.map(item => {
                        return (
                            <img className="g_img" src={item.photo} alt={item.title} key={item._id}/>
                        )
                    })
                } 
            </div>
        </div>
    )
}

export default Profile