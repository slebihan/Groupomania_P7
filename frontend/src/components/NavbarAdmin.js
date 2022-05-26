import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import img from "../assets/img/icon-left-font-monochrome-black.svg";
import Logout from "./Logout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSignOut} from '@fortawesome/free-solid-svg-icons';
import "../components/NavbarAdmin.scss";

export default function NavbarAdmin() {

        const [admin,setAdmin] = useState([])
      
        const fetchData = () => {
          fetch("http://localhost:3000/api/UserProfile/Admin",{
            headers:{
            Authorization : 'Bearer ' + Cookies.get("jwt")
        }})
            .then(response => {
              return response.json()
            })
            .then(data => {
              setAdmin(data)
            })
        }
      
        useEffect(() => {
          
          fetchData()
        }, [])
    
  return (
  
    <div className="navbar">
      <div className="logo">
        <img src={img} alt="Logo" />
      </div>
      <div className="user-display">
        
        <h1> Bienvenue
         {admin.map((user) => {
          if (user.firstname === "Admin") {
           return <div key={user}>{user.firstname}</div>;
          } else {
          return <div key={user.id}></div>;
          }
        })}
        </h1>  
      <FontAwesomeIcon className="icon-signout" icon={faSignOut} style={{height:"30px"}} onClick={Logout} />
      </div>
     
    </div>
    
  );
  }
