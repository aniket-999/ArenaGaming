import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'

const Profile = ()=> {
    const [mypics,setPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setPics(result.mypost)
        })
     },[])
     useEffect(()=>{
        if(image){
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","twitch-clone")
        data.append("cloud_name","dvmtowfy1")
        fetch("https://api.cloudinary.com/v1_1/dvmtowfy1/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
        //   console.log(data.url);
            fetch("/updatepic",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                pic:data.url
            })
            }).then(res=>res.json())
            .then(result=>{
                console.log(result);
                localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}));
                dispatch({type:"UPDATEPIC",payload:result.pic});

            })
          })
       .catch(err=>{
           console.log(err)
       })
    }

     },[image])
     const updatePic = (file) => {
        setImage(file);
     }
    return (
        <div>
            <div 
                style={{display:"flex", justifyContent:"space-around", margin:"18px 0px"}}>
                <div>
                <img style={{width: "160px", height: "160px", borderRadius:"80px"}} 
                    src={state?state.pic:"ara ara"}
                />
                {/* <button className='btn' onClick={()=>updatePic()} > Update Pic </button> */}
                <div className='file-field input-field'>
                <div className="btn #64b5f6 blue darken-1">
                 <span>Update Image</span>
                 <input type="file" onChange={(e)=>updatePic(e.target.files[0])} />
             </div>
             <div className='file-path-wrapper'>
                    <input className='file-path-validate' type="text"/>
             </div>
                </div>
                </div>
                <div> 
                    <h4> {state?state.name:"ara ara"} </h4>
                    <h5> {state?state.email:"ara ara"} </h5>
                    <div 
                        style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
                        <h5> {mypics.length} posts </h5>
                        <h5> {state?state.followers.length:"0"} followers </h5>
                        <h5> {state?state.following.length:"0"} following </h5>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    mypics.map(item=>{
                        return (
                            <img  key={item._id} className='item homeImage' src={item.photo} alt={item.title}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Profile