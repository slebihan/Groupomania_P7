import React from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Logout = function () {
  axios
    .post("http://localhost:3000/api/logout", { withCredentials: true })
    .then((success) => {
      window.location.replace("http://localhost:3001/api/logout");
      Cookies.remove("jwt", success.data.token, { secure: true });
    });

  return <div></div>;
};
export default Logout;
