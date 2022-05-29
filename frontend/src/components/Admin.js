import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Navbar from "./Navbar";
import Message from "./Message";
import CreatePost from "./CreatePost";
import { useParams } from "react-router-dom";

const AdminPage = (req, res) => {
    function checkIsAdmin() {
      const token = Cookies.get("jwt");
      // terminate operation if token is invalid
      // Split the token and taken the second
      const base64Url = token.split(".")[1];
      // console.log(base64Url);
      // Replace "-" with "+"; "_" with "/"
      const base64 = base64Url.replace("-", "+").replace("_", "/");
      // console.log(base64);
      const decodedToken = JSON.parse(window.atob(base64));
      console.log(decodedToken);

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

    </React.Fragment>
  );
};

export default AdminPage;
