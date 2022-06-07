import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import {useRef} from 'react';

import Navbar from "./Navbar";
import "../styles/UserProfileEdit.scss";
import Footer from "./Footer";
const FormData = require("form-data");

export default function UserProfileEdit() {
  
  const userId = parseInt(useParams().userId);

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

    if (decodedToken.userId !== userId) {
      window.location.assign("http://localhost:3001/api/logout");
    }
  }
  checkIsAdmin();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");

  const params = useParams();
  let navigate = useNavigate();

  axios
    .get("http://localhost:3000/api/UserProfileEdit/" + params.userId, {
      headers: {
        Authorization: "Bearer " + Cookies.get("jwt"),
      },
    })
    .then((success) => {
      setFirstname(success.data.firstname);
      setLastname(success.data.lastname);
      setEmail(success.data.email);
    });

  const deleteAccount = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre profil?")) {
      axios
        .delete("http://localhost:3000/api/UserProfileEdit/" + params.userId, {
          headers: {
            Authorization: "Bearer " + Cookies.get("jwt"),
          },
        })
        .then((success) => {
          console.log(success);
          alert("Votre profil a bien été supprimé !");
        })
        .then(navigate("/"));
    }
  };

  const emailRegExp = new RegExp("^.+(@groupomania.fr$)");
  const passwordRegExp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@+$!%*?&])[A-Za-z\d@$!%*+?&]{8,25}$/);

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      attachment: "",
    },
    onSubmit: (values) => {
      const Lastnamevalue = document.getElementById("lastname").value;
      const Firstnamevalue = document.getElementById("firstname").value;
      const password = document.getElementById("password").value;
      const EmailValue = document.getElementById("email").value;
      let formData = new FormData();

      formData.append("firstname", Firstnamevalue);
      formData.append("lastname", Lastnamevalue);
      formData.append("email", EmailValue);
      formData.append("password", password);
      formData.append("attachment", values.attachment);
   

      if (
        !passwordRegExp.test(values.password) ||
        !emailRegExp.test(values.email)
      ) {
        alert(
          "Merci de remplir un email @groupomania.fr et Le mot de passe est de minimum 8 caractères et maximum 25 caractères, doit contenir une minuscule,une majuscule,un chiffre et un caractère spécial @$!%+*?& "
        );
      } else {
        if (
          window.confirm("Etes-vous sûr de vouloir modifier votre profil ?")
        ) {
          axios
            .put(
              "http://localhost:3000/api/UserProfileEdit/" + params.userId,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: "Bearer " + Cookies.get("jwt"),
                },
              }
            )
            .then(() => {
              alert("Votre profil a bien été mis à jour");
              setAvatar();
              formik.resetForm();
              formik.resetForm({attachment:null})
            })
            .catch((error) => alert("error"));
        }
      }
    },
  });

  useEffect(() => {
    const OneUserInfo = () => {
      axios
        .get(`http://localhost:3000/api/UserProfileEdit/` + params.userId, {
          headers: {
            Authorization: "Bearer " + Cookies.get("jwt"),
          },
        })
        .then((success) => {
          setFirstname(success.data.firstname);
          setAvatar(success.data.attachment);
        });
    };
    OneUserInfo();
  });

  function deleteImageProfil() {
    if (window.confirm("Etes-vous sûr de vouloir supprimer votre avatar ?")) {
      axios
        .put(
          `http://localhost:3000/api/UserProfileEdit/avatar/` + params.userId,
          {
            body: { userId: params.userId }},
            {headers: {
              Authorization: "Bearer " + Cookies.get("jwt"),
            }}
        )
        .then((success) => {
          setAvatar();
        })
        .catch((err) => console.log(err));
    } else {
      return;
    }
  }

  const inputRef = useRef(null);


  const resetFileInput = () => {
    inputRef.current.value = null;
  };

  return (
    <div className="container-profil">
      <Navbar />
      <div className="cardcontainer-infosUser">
        <div className="card-infosUser">
          <div className="title">
            <h1>Mes Informations</h1>
          </div>
          <div className="card-infosUser-display">
            <div className="avatar-display">
              <img src={avatar} alt="avatar" id="avatar" />
              <button onClick={deleteImageProfil} aria-label="Suppression Avatar" className="deleteImageProfil">
                Supprimer mon avatar
              </button>
            </div>

            <div className="infosUser-display">
              <h2>Prénom : {firstname}</h2>
              <h2>Nom : {lastname}</h2>
              <h2>Email : {email}</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="profil-edit">
        <h1 className="title">Modification du Profil</h1>
        <form
          name="form"
          className="informations"
          encType="multipart/form-data"
          onSubmit={formik.handleSubmit}
        >
          <label htmlFor="firstname">Prénom </label>
          <input
            id="firstname"
            name="firstname"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.firstname || ""}
          />
          <label htmlFor="lastname">Nom </label>
          <input
            id="lastname"
            name="lastname"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.lastname || ""}
          />
          <label htmlFor="email">Email </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email || ""}
          />
          <label htmlFor="password">Password </label>
          <input
            id="password"
            autoComplete="off"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password || ""}
          />
          <label> Choisir son avatar
          <input
            id="attachment"
            ref={inputRef}
            type="file"
            name="image"
            onChange={(event) =>
              formik.setFieldValue("attachment", event.target.files[0])
            }
          /></label>

          <div className="btnActionprofil">
            <button type="submit" onClick={resetFileInput} aria-label="modification du compte">Modifier mon compte</button>
            <button onClick={deleteAccount} aria-label="suppression du compte">Supprimer mon compte</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
