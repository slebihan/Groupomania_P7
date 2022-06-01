import axios from "axios";
import React,{useState} from "react";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import InputEmoji from "react-input-emoji";
import "../styles/CreatePost.scss";

const FormData = require('form-data');

export default function Post() {

  const token = Cookies.get("jwt");
  // terminate operation if token is invalid
  // Split the token and taken the second
  const base64Url = token.split(".")[1];
  // console.log(base64Url);
  // Replace "-" with "+"; "_" with "/"
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  // console.log(base64);
  const decodedToken = JSON.parse(window.atob(base64));

  const userId = decodedToken.userId;
  
  const [contentMessage,setContentMessage] = useState(null)

  const formik = useFormik({
   initialValues : {
    UserId: userId,
    content: "",
    title: '', 
    attachment: null,
  },
   onSubmit : (values) => {
     var title = document.getElementById('title').value
     var content = contentMessage

     let formData = new FormData()

    formData.append('UserId',userId)
    
    formData.append('title',title)
    formData.append('content',content)
    formData.append('attachment',values.attachment)


    axios
      .post("http://localhost:3000/api/messages",formData,{
    
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization": "Bearer " + Cookies.get("jwt"),
        },
      })
      .then(() => alert("Votre publication a bien été ajoutée"))
      .then(()=> window.location.reload())
      .catch((error) => alert("Oops, les champs sont vides :) "));
  }

})


  return (
    <section className="Wall">
      <form onSubmit={formik.handleSubmit} className="post-container">
        <h2>Exprimez-vous ...</h2>
        <label htmlFor="titre">Titre </label>
        <input
          id="title"
          name="title"
          onChange={formik.handleChange}
          value={formik.values.title || ""}
          type="text"
          placeholder="Entrez un titre"
        ></input>

        <label htmlFor="content">Message </label>

        <InputEmoji
          
          value={formik.values.content}
          onChange={setContentMessage}
          placeholder="Tapez votre message"
        />

        <div className="choose-file">
          <label htmlFor="choose-file"> Choisir un fichier
          <input
            id="choose-file"
            type="file"
            name="image"
            onChange={(event) =>
              formik.setFieldValue("attachment", event.target.files[0])
            }
            style={{ padding: "10px" }}
          />
          </label>
        </div>

        <div className="bouton-container">
          <button type="submit" aria-label="Publier">Publier</button>
        </div>
      </form>
    </section>
  );
}
