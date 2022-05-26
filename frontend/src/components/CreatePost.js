import axios from "axios";
import React,{useState,useEffect} from "react";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import InputEmoji from "react-input-emoji";
// import Picker from 'emoji-picker-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceSmile
} from "@fortawesome/free-regular-svg-icons";

import "./CreatePost.scss";
import { useParams } from "react-router-dom";
const FormData = require('form-data');



export default function Post() {
  const id = useParams().userId;

  const [messages, setMessages] = useState([]);
  const [contentMessage,setContentMessage] = useState(null)

  const messageData = (req, res, next) => {
    axios.get("http://localhost:3000/api/messages").then((res) => {
      console.log(res.data[3]);
      setMessages(res.data);
    });
  };

  useEffect(() => {
    messageData();
  }, []);

  const [chosenEmoji, setChosenEmoji] = useState(null);

  const onEmojiClick = (event,emojiObject) => {
    setChosenEmoji(emojiObject);
  };

  const formik = useFormik({
   initialValues : {
    UserId: id,
    content: "",
    title: '', 
    attachment: null,
  },
   onSubmit : (values) => {
     var title = document.getElementById('title').value
     var content = contentMessage
     console.log(content)
     let formData = new FormData()

     console.log(title)
    formData.append('UserId',id)
    
    formData.append('title',title)
    formData.append('content',content)
    console.log(content)
    formData.append('attachment',values.attachment)
    console.log(values.attachment)

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

// const [show, setShow] = useState(false)


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

        {/* {chosenEmoji ? (
          <textarea
            id="content"
            name="content"
            type="text"
            placeholder="Publiez votre message"
            maxLength="250"
            rows="20"
            cols="35"
            onChange={formik.handleChange}
            value={formik.values.content || chosenEmoji.emoji}
          ></textarea>
        ) : (
          <textarea
            id="content"
            name="content"
            type="text"
            placeholder="Publiez votre message"
            maxLength="250"
            rows="50"
            cols="35"
            onChange={formik.handleChange}
            value={formik.values.content}
          ></textarea>
        )} */}
        {/* <div className="add-smiley">
            <FontAwesomeIcon
              style={{ cursor: "pointer" }}
              icon={faFaceSmile}
              onClick={() => setShow(!show)}
            />
          </div> */}

        <InputEmoji
          
          value={formik.values.content}
          onChange={setContentMessage}
          placeholder="Tapez votre message"
        />
        <div className="choose-file">
          <input
            type="file"
            name="image"
            onChange={(event) =>
              formik.setFieldValue("attachment", event.target.files[0])
            }
            style={{ padding: "10px" }}
          />
        </div>

        {/* {show ? (
          <Picker
            onEmojiClick={onEmojiClick}
            disableSearchBar={true}
            pickerStyle={{
              width: "400px",
              height: "250px",
              position: "absolute",
              right: "400px",
              top: "600px",
              zIndex: "20",
            }}
          />
        ) : null} */}

        <div className="bouton-container">
          <button type="submit">Publier</button>
        </div>
      </form>
    </section>
  );
}
