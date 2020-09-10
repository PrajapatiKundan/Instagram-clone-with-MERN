import React, {useEffect, useState, useContext} from 'react';
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'

const Home = () => {
    const [data, setData] = useState([])//all the posts
    const { state, dispatch } = useContext(UserContext)

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
            console.log("LIKE Result: ",result)

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
            console.log("UNLIKE : ",result)
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
            console.log("Result : ",result)
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
                data.map( (item, i) => {
                    // console.log("ITEM : ",item)
                    // console.log("length : ",item.like.length)
                    return (
                        <div className="card mb-3 home-card" key={i}>
                            <h5 className="card-title mt-2 ml-2">
                            <Link
                                to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id:"/profile"}
                                style={{textDecoration: "none",color:"black"}}
                            >{item.postedBy.name}</Link>
                            
                            {
                                item.postedBy._id === state._id
                                &&
                                <i 
                                    className="fas fa-trash-alt fa-sm float-right mt-1 mr-2" 
                                    style = {{cursor: "pointer"}}
                                    onClick = {() => deletePost(item._id)}
                                ></i>
                            }                                
                            </h5>
                            <img src={item.photo} className="card-img-top" alt="no"/>
                            <div className="card-body">
                                <i className="fas fa-heart fa-2x ml-1" style = {{ color:"#ff0000"}}></i>
                                {
                                    //if userId is in like arr show unlike button
                                    item.like.includes(state._id) 
                                    ? 
                                    <i 
                                        className="far fa-thumbs-down fa-2x ml-3"
                                        
                                        style = {{ color:"#1890ff",cursor: "pointer"}}
                                        onClick={()=>unlikePost(item._id)}
                                    ></i>
                                    :
                                    <i 
                                        className="far fa-thumbs-up fa-2x ml-3"
                                        style = {{ color:"#1890ff", cursor: "pointer"}} 
                                        onClick={()=>likePost(item._id)}
                                    ></i>
                                }                                                                                                                         
                                <h6>{ item.like.length } likes</h6>
                                <h6>{ item.title }</h6>
                                <p>{ item.body }</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <p key={record._id}>
                                            {                                                 
                                                
                                                record.postedBy._id === state._id
                                                &&
                                                <i 
                                                    className="fas fa-trash-alt fa-sm mr-1" 
                                                    style = {{cursor: "pointer"}}
                                                    onClick = {() => deleteComment(item._id, record._id)}
                                                ></i>
                                            }
                                            <span style={{fontWeight:"500"}}>{record.postedBy.name} </span>
                                            {record.text}
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