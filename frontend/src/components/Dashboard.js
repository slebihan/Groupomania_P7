import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Navbar from "./Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
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

  const [rangeValue, setRangeValue] = useState(1);

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const fetchUser = useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:3000/api/UserProfile/Admin", {
        headers: {
          Authorization: "Bearer " + Cookies.get("jwt"),
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setUsers(data);
        });
    };

    fetchData();
  }, []);

  const handleSearchTerm = (e) => {
    let value = e.target.value;
    setSearchTerm(value);
  };
  console.log(searchTerm);

  function deleteAccountbyAdmin(id) {
    if (
      window.confirm("Souhaitez vous réellement supprimer cet utilisateur ?")
    ) {
      axios
        .delete(`http://localhost:3000/api/UserProfile/Admin/${id}`, {
          headers: {
            Authorization: "Bearer " + Cookies.get("jwt"),
          },
        })
        .then(() => alert("Le compte de l'utilisateur a bien été supprimé"))
        .then(()=> fetchUser())
        .catch((err) => console.log(err));
    }
  }

  return (
    <React.Fragment>
      <Navbar />
      <div className="title-container">
        <h1>Dashboard</h1>
        <input
          type="text"
          name="searchBar"
          id="searchBar"
          placeholder="Rechercher"
          onChange={handleSearchTerm}
        />
        <label
          htmlFor="username"
          style={{ marginLeft: "30px", marginRight:"30px" }}
        >
          Recherche par Nom de Famille
        </label>
        <input
          type="range"
          min="1"
          max="20"
          defaultValue={rangeValue}
          onChange={(e) => setRangeValue(e.target.value)}
        ></input>
      </div>

      <div className="userlist-container">
        {users
          .filter((val) => {
            return val.firstname.includes(searchTerm);
          })
          .sort((a, b) => a.lastname.localeCompare(b.lastname))
          .slice(0, rangeValue)
          .map((user) => (
            <ul className="userlist-information" key={user.id}>
              <img src={user.attachment} alt="avatar" id="avatar" />
              <li>Prénom : {user.firstname}</li>
              <li>Nom : {user.lastname}</li>
              <li>Email : {user.email}</li>
              <FontAwesomeIcon
                cursor="pointer"
                fontSize={20}
                icon={faTrashCan}
                onClick={() => deleteAccountbyAdmin(user.id)}
              />
            </ul>
          ))}
      </div>
    </React.Fragment>
  );
}
