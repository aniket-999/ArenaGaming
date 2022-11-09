import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import { useParams } from 'react-router-dom'
// import SupportButton from './SupportButton'


function loadScript(src) {
    return new Promise(resolve=> {

        const script = document.createElement('script')
        script.src = src
        document.body.appendChild(script)
        script.onload = () =>{
            resolve(true);
        }
        script.onerror = () => {
            resolve(false);
        }
        document.body.appendChild(script)
    })
}

const __DEV__ = document.domain === 'localhost'

const Profile = ()=> {
    const [userProfile,setProfile] = useState(null)
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    const {userid} = useParams()
    const [showfollow , setShowFollow] = useState(state?!state.following.includes(userid) : true);
    // const userName = state.name;
    // const userEmail = state.email;
    // const [name, setName] = useState(userName)
    // const [email, setEmail] = useState(userEmail)

    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
          
             setProfile(result)
        })
     },[])

     const followUser = () =>{
        fetch("/follow",{
            method: "put",
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res=> res.json())
        .then(data=>{
            console.log(data);
            console.log("Teri maa ki chut");
            dispatch({type: "UPDATE",payload:{following: data.following,followers: data.followers}})
            localStorage.setItem("user",JSON.stringify(data));
            setProfile((prevState) =>{
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers: [...prevState.user.followers,data._id]
                    }
                }
            })
            setShowFollow(false);
        })
     }

     const unfollowUser = () =>{
        fetch("/unfollow",{
            method: "put",
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res=> res.json())
        .then(data=>{
            console.log(data);
            dispatch({type: "UPDATE",payload:{following: data.following,followers: data.followers}})
            localStorage.setItem("user",JSON.stringify(data));
            setProfile((prevState) =>{
                const newFollower = prevState.user.followers.filter((item =>item !== data._id))
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers: newFollower
                    }
                }
            })
            setShowFollow(true)
        })
    }

    async function displayRazorpay() {
        const res = loadScript('https://checkout.razorpay.com/v1/checkout.js')
        if(!res) {
            alert('Razorpay SDK failed to load. Check your internet connection')
            return
        }
        
        const data = await fetch("/razorpay", {
            method: 'POST',
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then((e)=> e.json()
        )
        console.log(data);

        const options = {
            "key": __DEV__ ? "rzp_test_OzIqGmavOiK6Tx" : 'PRODUCTION_KEY', // Enter the Key ID generated from the Dashboard
            currency: data.currency,
            amount: data.amount.toString(),
            order_id: data.id,
            name: "Support User",
            description: "Thankyou for supporting user",
            image: "https://example.com/your_logo",
            handler: function (response){
                alert(response.razorpay_payment_id);
                alert(response.razorpay_order_id);
                alert(response.razorpay_signature)
            },
            "prefill": {
            },
        };
        var paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }


    return (
        <>
        {
            userProfile 
            ?
            <div>
                <div 
                    style={{display:"flex", justifyContent:"space-around", margin:"18px 0px"}}>
                    <div>
                    <img style={{width: "160px", height: "160px", borderRadius:"80px"}} 
                        src={userProfile.user.pic}
                    />
                    </div>
                    <div> 
                        <h4> {userProfile.user.name} </h4>
                        <h5> {userProfile.user.email} </h5>
                        <div
                            style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
                            <h5> {userProfile.posts.length} posts </h5>
                            <h5> {userProfile.user.followers.length} followers </h5>
                            <h5> {userProfile.user.following.length} following </h5>
                        </div>
                        {showfollow? <button className='btn' onClick={()=>followUser()} > Follow </button> : <button className='btn' onClick={()=>unfollowUser()} > Unfollow </button>}
                        {/* <SupportButton/> */}
                        <div>
                            <button className='btn'
                                onClick={displayRazorpay}> 
                                Support User 
                            </button>
                        </div>


                    </div>

                </div>
                <div className="gallery">
                    {
                        userProfile.posts.map(item=>{
                            return (
                                <img  key={item._id} className='item homeImage' src={item.photo} alt={item.title}/>
                            )
                        })
                    }
                </div>
            </div>

            :
            <h2>Loding...</h2>
        }
        </>
    )
}

export default Profile


//secret: Goldflake