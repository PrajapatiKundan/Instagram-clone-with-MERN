import React, {useEffect, useState, useContext} from 'react';
import {UserContext} from '../../App'
//import './signin.css';

const Profile = () => {
    const [mypics, setMypics] = useState([])
    const {state, dispatch} = useContext(UserContext)

    useEffect(() => {
        fetch('/mypost', {
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            //console.log("RESULT in profile",result)
            setMypics(result.myposts)
        })
    },[])
    return (
        <div style={{ maxWidth:"550px", margin:"0px auto"}}>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "18px 0",
                borderBottom: "1px solid grey"
            }}>
                <div>
                    <img 
                        style={{width:"160px", height:"160px", borderRadius:"80px"}}
                        src={require('./images/profile.jpg')}
                        alt="No profile"
                    />
                </div>
                <div>
                    <div style={{margin:"22% 0"}}>
                    <h4>{state ? state.name:"loading"}</h4>
                    <div style={{ display:"flex", justifyContent:"space-between", width:"108%"}}>
                        <h6>40 posts</h6>
                        <h6>40 followers</h6>
                        <h6>40 followings</h6>
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