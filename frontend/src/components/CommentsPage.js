import { useParams } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useFormik } from "formik";
import CommentCard from "./CommentCard";
import "./Comments.scss";
import Navbar from "./Navbar";


export default function Comment() {

  const messageid = useParams().id;

  const [onePost, setOnePost] = useState([]);
  useEffect(() => {
    const getOnePost = (req, res, next) => {
      axios
        .get(`http://localhost:3000/api/messages/${messageid}`)
        .then((res) => {
          console.log(res.data);
          setOnePost(res.data);
        });
    };
    getOnePost();
  }, []);

   const [users, setUsers] = useState([]);
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

  useEffect(() => {
    fetchData();
  }, []);

  const token = Cookies.get("jwt");

  // terminate operation if token is invalid
  // Split the token and taken the second
  const base64Url = token.split(".")[1];
  // console.log(base64Url);
  // Replace "-" with "+"; "_" with "/"
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  // console.log(base64);
  const decodedToken = JSON.parse(window.atob(base64));
  // console.log(decodedToken);
  const decodedTokenID = decodedToken.userId;
  // console.log(decodedTokenID);

  const formik = useFormik({
    initialValues: {
      MessageId: messageid,
      UserId: decodedTokenID,
      content: "",
      attachment: null,
    },
    onSubmit: (values) => {
      console.log(values.attachment);
      const content = document.getElementById("content").value;

      let formData = new FormData();
      formData.append("MessageId", messageid);
      formData.append("UserId", decodedTokenID);
      formData.append("content", content);
      formData.append("attachment", values.attachment);

      axios
        .post("http://localhost:3000/api/comments", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + Cookies.get("jwt"),
          },
        })
        .then((success) => {
          alert('Votre commentaire a bien été publié');
          window.location.reload()
        })
        .catch((error) => alert("error"));
    },
  });

  const [AllComments, setAllComments] = useState([]);
  useEffect(() => {
    const getAllComments = (req, res, next) => {
      axios.get(`http://localhost:3000/api/comments`).then((res) => {
        console.log(res.data);
        setAllComments(res.data);
      });
    };
    getAllComments();
  }, []);

  const [messages, setMessages] = useState([]);

  const messageData = (req, res, next) => {
    axios.get("http://localhost:3000/api/messages").then((res) => {
      console.log(res.data[0]);
      setMessages(res.data);
    });
  };

  useEffect(() => {
    messageData();
  }, []);
  
  

  return (
    <div>
      <Navbar />
      <div className="comment-container">
     
        <div className="card-container">
        <div className="info-userpublisher">
          {users.map(
            (user) =>
              user.id === onePost.UserId && (
                <img
                  src={user.attachment}
                  alt="userpicture"
                  id="avatar"
                  key={user.id}
                />
              )
          )}
          
          {onePost.UserId && (
            <p>
            {`Publié le : ${new Intl.DateTimeFormat("fr-FR").format(
                new Date(onePost.createdAt)
              )}`}
            </p>
          )}
          </div>
          
          <div className="message-container">
          <h1 className="">{onePost.title}</h1>
          <h2 className="">{onePost.content}</h2>
          {onePost.attachment !==null && <img src={onePost.attachment} alt="attachment"></img>}
          <form onSubmit={formik.handleSubmit}>
            <div className="answer-card">
              <textarea
                name="content"
                id="content"
                cols="60"
                rows="5"
                onChange={formik.handleChange}
                value={formik.values.content || ""}
              ></textarea>
            </div>
            <input
              type="file"
              name="image"
              onChange={(event) =>
                formik.setFieldValue("attachment", event.target.files[0])
              }
            ></input>

            <button type="submit">Commenter</button>
          </form>
        </div>
        </div>
      </div>
      <CommentCard />
      
    </div>
  );
}
