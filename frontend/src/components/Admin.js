import React from "react";
import Cookies from "js-cookie";
import Navbar from "./Navbar";
import Message from "./Message";
import CreatePost from "./CreatePost";
import Footer from "./Footer";


const Admin = (req, res) => {
    function checkIsAdmin() {
      const token = Cookies.get("jwt");
      if(token === undefined){
        window.location.assign("http://localhost:3001/api/logout")
      }
      // terminate operation if token is invalid
      // Split the token and taken the second
      const base64Url = token.split(".")[1];
      // console.log(base64Url);
      // Replace "-" with "+"; "_" with "/"
      const base64 = base64Url.replace("-", "+").replace("_", "/");
      // console.log(base64);
      const decodedToken = JSON.parse(window.atob(base64));
    

      if (decodedToken.isAdmin !== true) {
        window.location.assign("http://localhost:3001/api/logout");
      }
    }
  checkIsAdmin();



  return (
    <React.Fragment>
      <Navbar />
      <CreatePost />
      <Message/>
      <Footer />

    </React.Fragment>
  );
};

export default Admin;
