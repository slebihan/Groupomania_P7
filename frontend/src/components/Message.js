import axios from "axios";
import React, { useEffect, useState } from "react";
import "../styles/Message.scss";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsDown,
  faThumbsUp,
  faTrashCan,
  faEdit,
  faComments,
  faReply,
} from "@fortawesome/free-solid-svg-icons";

export default function Message() {

  const [textUpdateContent, setTextUpdateContent] = useState(null);
  const [textUpdateTitle, setTextUpdateTitle] = useState(null);
  const [textUpdateComment, setTextUpdateComment] = useState(null);

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


  const [messages, setMessages] = useState([]);

  const messageData = (req, res, next) => {
    axios.get("http://localhost:3000/api/messages").then((res) => {
      console.log(res.data)
      setMessages(res.data);
    });
  };

  useEffect(() => {
    messageData();
  }, []);

  const [comments, setComments] = useState([]);

  const commentData = (req, res, next) => {
    axios.get("http://localhost:3000/api/comments").then((res) => {
      setComments(res.data);
    });
  };

  useEffect(() => {
    commentData();
  }, []);

  
  function like(id) {
    axios
      .post(`http://localhost:3000/api/messages/${id}/like`, {
        userId: userId,
        MessageId: id,
      })
      .then(() => messageData())

      .catch((err) => console.log(err));
  }

  function unlike(id) {
    axios
      .post(`http://localhost:3000/api/messages/${id}/unlike`, {
        userId: userId,
        MessageId: id,
      })
      .then(() => messageData())
      .catch((err) => console.log(err));
  }

  function deleteMessage(id) {
    if (
      window.confirm("Souhaitez vous réellement supprimer cette publication ?")
    ) {
      axios
        .delete(`http://localhost:3000/api/messages/${id}`, {
          headers: {
            Authorization: "Bearer " + Cookies.get("jwt"),
          },
        })
        .then(() => console.log("Votre publication a bien été supprimée"))
        .then(() => messageData())
        .catch((err) => console.log(err));
    }
  }

  function modifyMessage(id) {
    axios
      .put(`http://localhost:3000/api/messages/${id}`, {
        body: { content: textUpdateContent, title: textUpdateTitle },
        headers: {
          Authorization: "Bearer " + Cookies.get("jwt"),
          "Content-Type": "multipart/form-data,application/json",
        },
      })
      .then(() => messageData())
      .catch((err) => console.log(err));
  }

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

  const buttons = Array.from(document.querySelectorAll(".edit"));

  buttons.forEach((button) => {
    button.onclick = function () {
      const areaContent = this.parentNode;
      const publications = areaContent.querySelectorAll(".publication");

      publications.forEach((publication) => {
        publication.classList.toggle("show");
      });
    };
  });

  const btns = Array.from(document.querySelectorAll(".btn.publication"));

  btns.forEach((button) => {
    button.onclick = function () {
      const message = this.parentNode;
      const messageContent = message.querySelectorAll(".publication");

      messageContent.forEach((publication) => {
        publication.classList.toggle("show");
      });
    };
  });

  function CommentMessage(id) {
    axios
      .post("http://localhost:3000/api/comments", {
        body: { UserId: userId, MessageId: id, content: textUpdateComment },
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + Cookies.get("jwt"),
        },
      })
      .then((success) => {
        alert("Votre commentaire a bien été publié");
        commentData();
      })
      .catch((error) => alert("Merci de saisir un contenu"));
  }

  function deleteComment(id) {
    if (
      window.confirm("Souhaitez vous réellement supprimer cette publication ?")
    ) {
      axios
        .delete(`http://localhost:3000/api/comments/${id}`, {
          headers: {
            Authorization: "Bearer " + Cookies.get("jwt"),
          },
        })
        .then(() => "Votre publication a bien été supprimée")
        .then(() => commentData())
        .catch((err) => console.log(err));
    }
  }

  return (
    <section className="comment_container">
      {messages.map((message) => (
        <div className="message" key={message.id}>
          {message.User.id && (
          
          <div className="info-messagepublisher">
                  <div className="flex">
                  <img
                    src={message.User.attachment}
                    alt="userpicture"
                    id="avatar"
                  />
                  <p>
                    Publié par{" "}
                    <strong style={{ fontSize: "15px" }}>
                      {message.User.firstname}
                    </strong>
                    <br />
                    le :{" "}
                    {`${new Intl.DateTimeFormat("fr-FR").format(
                      new Date(message.createdAt)
                    )}`}
                  </p>
                  </div>
          
                  <p>
                  {`Mis à jour le : ${new Intl.DateTimeFormat("fr-FR").format(
                  new Date(message.updatedAt)
                  )}`}
                  </p>
          </div> )}

          <div className="content-update">
            <input
              onChange={(e) => setTextUpdateTitle(e.target.value)}
              defaultValue={message.title}
              type="text"
              className="input-title publication"
              placeholder="Entrez votre modification"
            />

            <textarea
              onChange={(e) => setTextUpdateContent(e.target.value)}
              defaultValue={message.content}
              typeof="text"
              className="content  publication"
              placeholder="Entrez votre message"
            ></textarea>
            <button
              aria-label="modification"
              className="btn publication"
              onClick={() => modifyMessage(message.id)}
            >
              Valider modification
            </button>
            <h1>{message.title}</h1>
            <h2>{message.content}</h2>
            {message.attachment !== null && (
              <a href={message.attachment}>
              <img
                src={message.attachment}
                alt="attachment"
                defaultValue={message.attachment}

              ></img>
              </a>
            )}
          </div>

          {(message.UserId === userId || decodedToken.isAdmin === true) && (
            <FontAwesomeIcon className="edit" icon={faEdit}/>
          )}

          {(message.UserId === userId || decodedToken.isAdmin === true) && (
            <FontAwesomeIcon
              onClick={() => deleteMessage(message.id)}
              icon={faTrashCan}
              className="delete"
            
            />
          )}

          <FontAwesomeIcon
            className="btn-comment"
            icon={faComments}
            style={{ height: "20px", cursor: "pointer" }}
          
          />
          {message.Comments.length}

          <FontAwesomeIcon
            onClick={() => {
              like(message.id);
            }}
            className={
              message.Likes.find((likes) => likes.UserId === userId)
                ? "btn-like-active"
                : "like"
            }
            icon={faThumbsUp}
          
          ></FontAwesomeIcon>
          {message.likes}

          <FontAwesomeIcon
            onClick={() => unlike(message.id)}
            className={
              message.Dislikes.find((dislikes) => dislikes.UserId === userId)
                ? "btn-dislike-active"
                : "dislike"
            }
            icon={faThumbsDown}
    
          />

          {message.dislikes}

          <div className="reply-container">
            <div className="createComment">
              <textarea
                type="text"
                cols="30"
                rows="5"
                placeholder="Commenter"
                onChange={(e) => setTextUpdateComment(e.target.value)}
              />
            </div>

            <div className="btn-reply">
              <FontAwesomeIcon
                icon={faReply}
                style={{ cursor: "pointer" }}
                onClick={() => CommentMessage(message.id)}
         
              />
            </div>
          </div>

          {comments.map(
            (comment) =>
              message.id === comment.MessageId && (
                <div className="comments" key={comment.id}>
                  {users.map(
                    (user,index) =>
                      user.id === comment.UserId && (
                        <div
                          className="comment-publisheravatar"
                          key={index}
                        >
                          <img
                            src={user.attachment}
                            alt="userpicture"
                            id="avatar"                 
                          />
                        </div>
                      )
                  )}
                    <div style={{ width: "100%" }}>
                      <div className="comment-infopublisher">
                        <div style={{ width: "85%" }}>
                          {users.map(
                          (user,index) =>
                            user.id === comment.UserId && (
                              <p key={index}>
                                Publié par <strong>{user.firstname}</strong>,
                              </p>
                            )
                        )}

                        <p>
                          le{" "}
                          {`${new Intl.DateTimeFormat("fr-FR").format(
                            new Date(comment.createdAt)
                          )}`}
                        </p>
                      </div> 
                      
                      {users.map(
                          (user,index) =>
                            user.id === comment.UserId && (
                            <div className="delete" key={index}>
                       
                              <FontAwesomeIcon
                                onClick={() => deleteComment(comment.id)}
                                icon={faTrashCan}
                                className="delete"
                                style={{ cursor: "pointer" }}
                                
                              />
                             
                      
                            </div>)
                        )}
                    </div>
                    <p>{comment.content}</p>
                  </div>
                </div>
              )
          )}
        </div>
      ))}
    </section>
  )
}
