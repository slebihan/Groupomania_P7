import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Message.scss";
// import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsDown,
  faThumbsUp,
  faTrashCan,
  faEdit,
  // faPlus,
  faComments,
  faReply,
} from "@fortawesome/free-solid-svg-icons";

import { useParams } from "react-router-dom";

export default function Message() {
  // let navigate = useNavigate();

  const [textUpdateContent, setTextUpdateContent] = useState(null);
  const [textUpdateTitle, setTextUpdateTitle] = useState(null);
  const [textUpdateComment, setTextUpdateComment] = useState(null);

  const userId = parseInt(useParams().userId);
  console.log(userId)

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

  const [messages, setMessages] = useState([]);

  const messageData = (req, res, next) => {
    axios.get("http://localhost:3000/api/messages").then((res) => {
      console.log(res.data[3]);
      setMessages(res.data);
    });
  };

  useEffect(() => {
    messageData();
  }, []);

  const [comments, setComments] = useState([]);

  const commentData = (req, res, next) => {
    axios.get("http://localhost:3000/api/comments").then((res) => {
      console.log(res.data[2]);
      setComments(res.data);
    });
  };

  useEffect(() => {
    commentData();
  }, []);

  function like(id) {
    console.log(id);

    axios
      .post(`http://localhost:3000/api/messages/${id}/like`, {
        userId: userId,
        MessageId: id,
      })
      .then(() => messageData())

      .catch((err) => console.log(err));
  }

  function unlike(id) {
    console.log(id);

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

  const title = textUpdateTitle;
  const content = textUpdateContent;
  console.log(title);
  console.log(content);

  function modifyMessage(id) {
    axios
      .put(`http://localhost:3000/api/messages/${id}`, {
        body: { content: content, title: title },
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
        console.log(data)
        setUsers(data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const buttons = Array.from(document.querySelectorAll(".edit"));
  console.log(buttons);

  buttons.forEach((button) => {
    button.onclick = function () {
      const areaContent = this.parentNode;
      console.log(areaContent);

      const publications = areaContent.querySelectorAll(".publication");
      console.log(publications);

      publications.forEach((publication) => {
        publication.classList.toggle("show");
      });
    };
  });

  const btns = Array.from(document.querySelectorAll(".btn.publication"));

  console.log(btns);

  btns.forEach((button) => {
    button.onclick = function () {
      const message = this.parentNode;
      console.log(message);

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
        <div className="message">
          <div className="info-userpublisher">
            {users.map(
              (user) =>
                user.id === message.UserId && (
                  <img
                    src={user.attachment}
                    alt="userpicture"
                    id="avatar"
                    key={user.attachment}
                  />
                )
            )}
            {users.map(
              (user) =>
                user.id === message.UserId && (
                  <p key={message.createdAt}>
                    Publié par{" "}
                    <strong style={{ fontSize: "15px" }}>
                      {user.firstname}
                    </strong>
                    <br />
                    le :{" "}
                    {`${new Intl.DateTimeFormat("fr-FR").format(
                      new Date(message.createdAt)
                    )}`}
                  </p>
                )
            )}
            <p key={message.updatedAt}>
              {`Mis à jour le : ${new Intl.DateTimeFormat("fr-FR").format(
                new Date(message.updatedAt)
              )}`}
            </p>
          </div>

        
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
              className="btn publication"
              onClick={() => modifyMessage(message.id)}
            >
              Valider modification
            </button>
            <h1>{message.title}</h1>
            <h2>{message.content}</h2>
            {message.attachment !== null && (
              <img
                src={message.attachment}
                alt="attachment"
                defaultValue={message.attachment}
                key={message.attachment}
              ></img>
            )}
          </div>

      
          {(message.UserId === userId || decodedToken.isAdmin === true) && (
            <FontAwesomeIcon className="edit" icon={faEdit} />
          )}


          {message.UserId === userId || decodedToken.isAdmin === true && (
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
          ></FontAwesomeIcon>

          {message.dislikes}

          {/* <div className="btn-seemore">
            <FontAwesomeIcon
              className="btn-more"
              onClick={() => navigate(`/publication/${message.id}`)}
              icon={faPlus}
              style={{ height: "20px", cursor: "pointer" }}
            />
          </div> */}

          <div className="reply-container">
            <div className="createComment">
              <textarea
                type="text"
                className="createComment"
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
                    (user) =>
                      user.id === comment.UserId && (
                        <div className="publisher-infos">
                          <img
                            src={user.attachment}
                            alt="avatar"
                            id="avatar"
                            key={user.attachment}
                          />
                        </div>
                      )
                  )}
                  <div style={{ width: "100%" }}>
                    <div className="comment-infopublisher">
                      <div style={{ width: "85%" }} key={message.infopublisher}>
                        {users.map(
                          (user) =>
                            user.id === comment.UserId && (
                              <p key={user.firstname}>
                                Publié par <strong>{user.firstname}</strong>,
                              </p>
                            )
                        )}

                        <p>
                          le{" "}
                          {`${new Intl.DateTimeFormat("fr-FR").format(
                            new Date(message.createdAt)
                          )}`}
                        </p>
                      </div>
                      <div className="delete">
                        {users.map(
                          (user) =>
                            user.id === comment.UserId && (
                              <FontAwesomeIcon
                                onClick={() => deleteComment(comment.id)}
                                icon={faTrashCan}
                                className="delete"
                                style={{ cursor: "pointer" }}
                              />
                            )
                        )}
                      </div>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                </div>
              )
          )}
        </div>
      ))}
    </section>
  );
}
