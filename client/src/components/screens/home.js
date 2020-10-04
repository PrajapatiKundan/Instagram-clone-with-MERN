import React, {useEffect, useState, useContext} from 'react';
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'

const Home = () => {
    const [data, setData] = useState([])//all the posts
    // eslint-disable-next-line
    const { state, dispatch } = useContext(UserContext)
    const [viewComment, setViewComment] = useState(false)

    useEffect(() => {
        fetch('/allpost', {
            //by default it is a get request
            headers:{
                "Authorization":"Bearer "+ localStorage.getItem("jwt")
            }
        })
        .then( res => res.json())
        .then( result => {
            setData(result.posts)
        })
        .catch(err => {console.log(err)})
    },[])

    const likePost = (id) =>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        })
        .then( res => res.json())
        .then( result => {

            //new data contains updated post data
            const newData = data.map( item => {
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        })
        .catch( err => {console.log(err)})
    }

    const unlikePost = (id) =>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        })
        .then( res => res.json())
        .then( result => {
            //new data contains updated post data
            const newData = data.map( item => {
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        })
        .catch( err => {console.log(err)})
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        })
        .then(res => res.json())
        .then( result => {
            
            const newData = data.map( item => {
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        })
        .catch( err => console.log(err))

    }

    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then( res => res.json())
        .then( result => {
            const newData = data.filter( item => {
                return item._id !== result._id
            })
            setData(newData)
        })
        .catch( err => console.log(err))
    }

    const deleteComment = (postId, commentId) => {
        
        fetch(`/deletecomment/${postId}/${commentId}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then( res => res.json())
        .then( result => {
            
            const newData = data.map( item => {
            
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
       
            })
            setData(newData)
        })
        .catch( err => console.log(err))
    }
    return (

        <div>
            {
                !data
                ?
                <p>Loading...!</p>
                :
                data.map( (item, i) => {
                    return (

                        <div className="card mb-3 home-card" key={i}>
                            <div style={{height: "32px",lineHeight: "32px"}}>
                            <Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id:"/profile"}>
                            <img 
                                style={{width:"32px", height:"32px", borderRadius:"50%", margin:"8px"}}
                                src={item.postedBy.profile_pic}
                                alt="No profile"
                            /></Link>
                            
                            <h5 className="card-title mt-2 ml-2" style={{display:"inline",position:"absolute", top:"3px", left:"40px"}}>
                            
                            <Link
                                to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id:"/profile"}
                                style={{textDecoration: "none",color:"black"}}
                            >{item.postedBy.name}</Link>
                            </h5>
                            {
                                item.postedBy._id === state._id
                                &&
                                <i 
                                    className="fas fa-trash-alt fa-sm mt-1 mr-2" 
                                    title="Delete Post"
                                    style = {{cursor: "pointer", position:"absolute",top:"12px", right:"6px"}}
                                    onClick = {() => deletePost(item._id)}
                                ></i>
                            }                                
                            </div>
                            
                            <img src={item.photo} className="card-img-top" alt="no" style={{marginTop:"16px"}}/>
                            <div className="card-body" >
                                <div style={{display:"flex", justifyContent:"space-between", marginTop:'-3px', marginBottom:'3px'}}>
                                    <div>
                                        <i className="fas fa-heart fa-2x ml-1" style = {{ color:"#ff0000", fontSize:"20px"}}></i>
                                        <span style={{marginLeft:'8px'}}>{ item.like.length } likes</span>
                                    </div>
                                    <div>
                                        {
                                        //if userId is in like arr show unlike button
                                        item.like.includes(state._id) 
                                        ? 
                                        <i 
                                            className="far fa-thumbs-down fa-2x ml-3"
                                            
                                            style = {{ color:"#1890ff",cursor: "pointer", fontSize:"20px"}}
                                            onClick={()=>unlikePost(item._id)}
                                        ></i>
                                        :
                                        <i 
                                            className="far fa-thumbs-up fa-2x ml-3"
                                            style = {{ color:"#1890ff", cursor: "pointer", fontSize:"20px"}} 
                                            onClick={()=>likePost(item._id)}
                                        ></i>
                                        }
                                    </div>
                                </div>
                                
                                <h6>{ item.title }</h6>
                                <p>{ item.body }</p>
                                <p onClick={() => setViewComment(!viewComment)} style={{cursor:"pointer", textDecoration: "underline", fontSize:"13px", color:"grey"}}>View comments</p>
                                {
                                    viewComment
                                    &&
                                    item.comments.map(record => {

                                        return (
                                            <p key={record._id}>
                                            <img 
                                                style={{width:"25px", height:"25px", borderRadius:"50%", margin:"8px"}}
                                                src={record.postedBy.profile_pic}
                                                alt="No profile"
                                            />
                                            <span style={{fontWeight:"500"}}>{record.postedBy.name} </span>
                                            <span style={{color:"grey"}}>{record.text}</span>
                                            {                                                 
                                                
                                                record.postedBy._id === state._id
                                                &&
                                                <i 
                                                    className="fa fa-times-circle" aria-hidden="true" 
                                                    style = {{cursor: "pointer", marginLeft:"8px",fontSize:"13px", fontWeight:"0px"}}
                                                    title="Remove Comment"
                                                    onClick = {() => deleteComment(item._id, record._id)}
                                                ></i>
                                            }
                                            </p>
                                        )
                                    })
                                }
                                <div style={{ margin: "2px auto"}}>
                                    <form
                                        onSubmit={(e)=>{
                                            e.preventDefault()
                                            makeComment(e.target.comment_txt.value,item._id)
                                            e.target.comment_txt.value = ""
                                        }}
                                    >
                                        <input name="comment_txt" className="inp ml-1 toInline" type="text" style={{width:"90%"}} placeholder="add a comment"/><br />
                                    </form>
                                </div>
                            </div>
                        </div>
                    )
                })
            }        
        </div>
    )
}

export default Home