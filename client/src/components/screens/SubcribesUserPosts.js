import React from 'react'
import "../../App.css"
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'

const SubcribesUserPosts = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        fetch('/getsubpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                setData(result.posts)
            })
    }, [])

    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                //   console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                  console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const makeComment = (text,postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.map(item=>{
              if(item._id==result._id){
                  return result
              }else{
                  return item
              }
           })
          setData(newData)
        }).catch(err=>{
            console.log(err)
        })
  }

    const deletePost = (postid) => {
        console.log(postid);
        fetch(`/deletepost/${postid}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
            })
    }

    const deleteComment = (postId,commentId)=>{
        fetch(`/deletecomment/${postId}/${commentId}`,{
          method:"delete",
          headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
          }
        }).then(res=>res.json())
        .then(result=>{
          const newData = data.map(item=>{
            if(item._id===result._id){
              result.postedBy=item.postedBy;
              return result
            }
            else{
              return item
            }
        })
        setData(newData);
        alert("Comment Deleted Successfully");
      })
      }
    return (
        <div className='home'>
            {
                data.map(item => {
                    return (
                        <div className='card home-card' key={item._id}>
                            <h5 style={{padding:"5px"}}><Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile"  }>{item.postedBy.name}</Link> {item.postedBy._id == state._id
                                && <i className='material-icons' onClick={()=>deletePost(item._id)} > 
                                    delete </i>
                            } </h5>
                            <div>
                                <img className='homeImage' src={item.photo} />
                            </div>
                            <div>
                                <div>
                                    <i className="material-icons" style={{ color: "red" }}>favorite</i>
                                    {item.likes.includes(state._id)
                                        ?
                                        <i className="material-icons"
                                            onClick={() => { unlikePost(item._id) }}
                                        >thumb_down</i>
                                        :
                                        <i className="material-icons"
                                            onClick={() => { likePost(item._id) }}
                                        >thumb_up</i>
                                    }
                                    <h5>{item.likes.length} likes</h5>
                                </div>
                                <h5>{item.title}</h5>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 className="m-0" key={record._id}> 
                                                <span>{record.postedBy.name}</span> 
                                                : <span className="text-secondary">{record.text}</span>
                                                {record.postedBy._id == state._id 
                                                && <i className="material-icons" style={{fontSize:"20px"}} 
                                                    onClick={()=>deleteComment(item._id,record._id)}>delete</i>}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                    <input
                                        id='comment_id'
                                        type="text"
                                        placeholder='add comment'
                                    />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SubcribesUserPosts;