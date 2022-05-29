import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Logout from "./Logout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleRoof, faSignOut, faUser, faUsersViewfinder } from "@fortawesome/free-solid-svg-icons";
import img from "../assets/img/icon.svg";
import "../components/Navbar.scss";

export default function Navbar() {
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 768px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 768px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  const params = useParams();
  const [firstname, setFirstname] = useState("");
  const [avatar, setAvatar] = useState("");
  const token = Cookies.get("jwt");

  useEffect(() => {
    function getUserData() {
      if (!token) {
        return;
      }

      const base64Url = token.split(".")[1];
      // console.log(base64Url);

      const base64 = base64Url.replace("-", "+").replace("_", "/");
      // console.log(base64);
      const decodedToken = JSON.parse(window.atob(base64));
      // console.log(decodedToken);
      const decodedTokenID = decodedToken.userId;

      axios
        .get(`http://localhost:3000/api/UserProfileEdit/` + decodedTokenID, {
          headers: {
            Authorization: "Bearer " + Cookies.get("jwt"),
          },
        })
        .then((response) => {
          setAvatar(response.data.attachment);
          setFirstname(response.data.firstname);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getUserData();
  });

  const [navSize, setnavSize] = useState("10rem");
  const [navColor, setnavColor] = useState("transparent");
  const listenScrollEvent = () => {
    window.scrollY > 10 ? setnavColor("#d05159") : setnavColor("transparent");
    window.scrollY > 10 ? setnavSize("8rem") : setnavSize("7rem");
  };
  useEffect(() => {
    window.addEventListener("scroll", listenScrollEvent);
    return () => {
      window.removeEventListener("scroll", listenScrollEvent);
    };
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {matches && (
        <header id="navbar">
          <nav
            style={{
              backgroundColor: navColor,
              height: navSize,
              transition: "all 1s",
            }}
          >
            <div className="logo">
              <img src={img} alt="Logo" />
            </div>
            <div className="user-display">
              <h1> Bienvenue {firstname}</h1>
              <div>
                <img alt="avatar" id="avatar" src={avatar}></img>
              </div>
              <div className="profil">
                {firstname !== "Admin" ? (
                <button
                  className="bouton-nav"
                  onClick={() =>
                    window.open(`/UserProfileEdit/` + params.userId, "_self")
                  }
                >
                  Mon profil
                </button>) : (
                     <button
                     className="bouton-nav"
                     onClick={() =>
                       window.open(`/UserProfile/Admin/Dashboard`, "_self")
                     }
                   >
                     Dashboard
                   </button>

                )}
                <FontAwesomeIcon
                  className="icon-signout"
                  icon={faSignOut}
                  style={{ height: "30px",color:"white" }}
                  onClick={Logout}
                />
              </div>
            </div>
          </nav>
        </header>
      )}

      {!matches && (
        <header id="navbar-small">
          <nav>
            <div className="container-corner">
              <div
                className={isOpen ? "circle-menu circle-anim" : "circle-menu"}
              >
                <div className="links-circle">
                  {firstname !== "Admin" ? (
                  <FontAwesomeIcon
                    style={{color:"white",cursor:"pointer"}}
                    fontSize={25}
                    icon={faUser}
                    onClick={() =>
                      window.open(`/UserProfileEdit/` + params.userId, "_self")
                    }
                  />) : (
                    
                    <FontAwesomeIcon
                    style={{color:"white",cursor:"pointer"}}
                    fontSize={30}
                    icon={faUsersViewfinder}
                    onClick={() =>
                      window.open(`/UserProfile/Admin/Dashboard`, "_self")
                    }
                  />)}


                  
                </div>
                <div className="links-circle">
                  <FontAwesomeIcon
                    style={{color:"white",cursor:"pointer"}}
                    fontSize={25}
                    icon={faSignOut}
                    onClick={Logout}
                  />
                </div>
              </div>
              <div className="btn-circle" onClick={() => setIsOpen(!isOpen)}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
              </div>
            </div>
          </nav>
        </header>
      )}
    </>
  );
}
