import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Signup = ()=> {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [pic, setPic] = useState();
    const [image, setImage] = useState("");
    const [url,setUrl] = useState("")

    useEffect(()=>{
        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                    return alert("Enter valid Email"); 
                }
        
         fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                name,
                email,
                password,
                pic:url
            })
         }).then(res=>res.json())
         .then(data=>{
     
            if(data.error){
               alert(data.error)
            }
            else{
                alert("Account Created Successfully!")
                navigate('/signin')
            }
         }).catch(err=>{
             console.log(err)
         })
     }
     ,[url])

    const postDetails = () => {
        const data = new FormData()
        data.append("file",image)
       data.append("upload_preset","twitch-clone")
       data.append("cloud_name","dvmtowfy1")
        // data.append("api_key", "343415612378642")
        fetch("https://api.cloudinary.com/v1_1/dvmtowfy1/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
       .then(data=>{
          setUrl(data.url)
       })
       .catch(err=>{
           console.log(err)
       })

    };

    return (
        <div>
            <h1>Signup</h1>
            <input 
                type="text"
                placeholder='name'
                value={name}
                onChange={(e)=>setName(e.target.value)}
            />
            <input 
                type="text"
                placeholder='email'
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
            />
            <input 
                type="password"
                placeholder='password'
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
            />
            <input
                type="file"
                accept='image/*'
                onChange={(e) => setImage(e.target.files[0])}
            />
            <button onClick={()=>postDetails()} className="btn" isLoading={loading}> Signup </button>
            <h5>
                Already have an account 
                    <Link to={"/signin"}> Signin</Link> 
            </h5>
        </div>
    )
}


export default Signup