import React, {useEffect, useState, useContext} from 'react';
import {UserContext} from '../../App'
import { useParams } from 'react-router-dom'
//import './signin.css';

const UserProfile = () => {
    const [userDetail, setUserDetail] = useState(null)
    const {state, dispatch} = useContext(UserContext)
    const {userId} = useParams()

    useEffect(() => {
        console.log("user id : ",userId)
        fetch(`/user/${userId}`, {
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            console.log("RESULT in user profile",result)
            setUserDetail(result)
        })
    },[])
    console.log("user detail:",userDetail)
    return (
        <>
        {
            !userDetail
            ?
            <h1>Loading...!</h1>
            :
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
                        <h4>{userDetail.user.name}</h4>
                        <h5>{userDetail.user.email}</h5>
                        <div style={{ display:"flex", justifyContent:"space-between", width:"108%"}}>
                            <h6>{userDetail.posts.length} posts</h6>
                            <h6>40 followers</h6>
                            <h6>40 followings</h6>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="gallery">
                    {
                        userDetail.posts.map(item => {
                            return (
                                <img className="g_img" src={item.photo} alt={item.title} key={item._id}/>
                            )
                        })
                    } 
                </div>
            </div>
        }
        </>
    )
}

export default UserProfile