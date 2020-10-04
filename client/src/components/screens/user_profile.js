import React, {useEffect, useState, useContext} from 'react';
import {UserContext} from '../../App'
import { useParams } from 'react-router-dom'

const UserProfile = () => {
    const [userDetail, setUserDetail] = useState(null)
    const {state, dispatch} = useContext(UserContext)
    const {userId} = useParams()

    useEffect(() => {
        
        fetch(`/user/${userId}`, {
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            setUserDetail(result)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    const followUser = () => {

        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                follow_id: userId
            })
        })
        .then(res => res.json())
        .then( data => {
            
            dispatch({
                type:"UPDATE",
                payload:{
                    followers:data.followers,
                    following:data.following
                }
            })

            localStorage.setItem("user", JSON.stringify(data))
            
            setUserDetail((prevState) => {
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers, data._id]
                    }
                }
            })
        })
    } 
    const unfollowUser = () => {

        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollow_id: userId
            })
        })
        .then(res => res.json())
        .then( data => {
            dispatch({
                type:"UPDATE",
                payload:{
                    followers:data.followers,
                    following:data.following
                }
            })

            localStorage.setItem("user", JSON.stringify(data))
            
            setUserDetail((prevState) => {
                const newFollowers = prevState.user.followers.filter(item => item !== data._id)
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollowers
                    }
                }
            })
        })
    } 

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
                    borderBottom: "1px solid grey",
                    height:"177px"
                }}>
                    <div>
                        <img 
                            style={{width:"160px", height:"160px", borderRadius:"80px"}}
                            src={userDetail.user.profile_pic}
                            alt="No profile"
                        />
                    </div>
                    <div>
                        <div style={{margin:"14% 0"}}>
                        <h4>{userDetail.user.name}</h4>
                        
                        <div style={{ display:"flex", justifyContent:"space-between", width:"108%"}}>
                            <h6>{userDetail.posts.length} posts</h6>
                            <h6>{userDetail.user.followers.length} followers</h6>
                            <h6>{userDetail.user.following.length} followings</h6>
                        </div>
                        <div style={{position:"absolute"}}>
                            {
                                !(userDetail.user.followers.includes(state._id))
                                ?
                                <button 
                                className="badge badge-secondary user-profile-btn" 
                                style={{borderRadius:"6px"}}
                                onClick={ () => followUser() }    
                                >Follow</button>
                                :
                                <button 
                                className="badge badge-secondary user-profile-btn" 
                                style={{borderRadius:"6px"}}
                                onClick={ () => unfollowUser() }    
                                >Unfollow</button>
                            }
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