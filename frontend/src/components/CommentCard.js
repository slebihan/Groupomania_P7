import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import "../components/CommentCard.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReply,
  faThumbsDown,
  faThumbsUp,
  faTrashCan,
  faEdit,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

export default function CommentCard() {

    const commentid = parseInt(useParams().id)
    console.log(commentid)

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
        .catch((err) => console.log(err));
    }
  }

  return (
    <div className="comment-wall">
      {AllComments.map((comment) => (
          comment.messageId === commentid && (
        <div className="container-answer">
          <div className="info-userpublisher">
            {users.map(
              (user) =>
                user.id === comment.UserId && (
                  <img
                    src={user.attachment}
                    alt="userpicture"
                    id="avatar"
                    key={user.id}
                  />
                )
            )}
            <p>
              {`Publié le : ${new Intl.DateTimeFormat("fr-FR", {
                dateStyle: "short",
                timeStyle: "short",
              }).format(new Date(comment.createdAt))}`}
            </p>
          </div>

          <div className="comment-card">
            <div>{comment.content}</div>
            {comment.attachment !== null && <img src={comment.attachment} alt="comment-attachment" />}
          </div>
          <div className="reactions">
            <FontAwesomeIcon
              onClick={() => deleteComment(comment.id)}
              icon={faTrashCan}
              className="delete"
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      )))}
    </div>
  );
}
