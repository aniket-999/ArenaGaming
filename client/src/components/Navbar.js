import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import "../App.css"
// import ReactNavbar from "react-responsive-animate-navbar";
// import {
//     HomeComponent,
//     ArticlesComponent,
//     AboutComponent,
//     ContactComponent,
//   } from "./components";

const NavBar = () => {
    const navigate = useNavigate();
    const {state, dispatch} = useContext(UserContext);
    const renderList = ()=> {
        if(state) {
            return [
                <div>
                <Link to='/profile'>Profile</Link>
                <Link to='/create'>Create Post</Link>
                <Link to="/myfollowingpost">Sub Post</Link>
                <button className="btn"
                    onClick={()=>{
                    localStorage.clear()
                    dispatch({type:"CLEAR"})
                    navigate('/signin')
                    }}
                    >
                        Logout
                </button>
                </div>
            ]
        } else {
            return [
                <div>
                    <Link to='/signin'>Login</Link>
                    <Link to='/signup'>Signup</Link>
                </div>
            ]
        }
    }
    return (
        <nav>
            <div className='topnav'>
                <Link to={state?'/':"/signin"}>Arena</Link>
                {renderList()}
            </div>
        </nav>
    )
}
export default NavBar