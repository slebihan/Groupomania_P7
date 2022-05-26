const models = require("../models");
const fs = require('fs');

  exports.createComment = async (req,res,next) =>{
    const message_id = req.body.body.MessageId;
    console.log(message_id)
  if (!req.body.body.content) {
    res.status(400).send({
      message: "merci de saisir un contenu !",
    });
  } else {
    console.log(message_id)
    models.Comment.create({
      MessageId : message_id,
      UserId: req.body.body.UserId,
      content: req.body.body.content,
      attachment: req.file ?`${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`: null,
    })
      .then(() =>
        res.status(201).json({
          message: "commentaire publié !",
        })
      )
      .catch((error) =>
        res.status(400).json({
          error,
        })
      );
  }

  }

  exports.getAllComments = async (req,res,next) =>{
    await models.Comment.findAll(
      {
        order : [['createdAt','DESC']]
      }
    )
      .then((success) => res.status(200).json(success))
      .catch((error) => res.status(500).json({ error }));
  }

  exports.deleteComment = async (req, res, next) => {
    
    const commentid = req.params.id
    console.log(commentid)
    
    
    
    // const message_id = req.params.id;
  
    models.Comment.findOne({ where : { id : commentid}})
    .then(comment => {
      if (comment.attachment !== null) {
  
        const filename = comment.attachment.split("/images/")[1];
        fs.unlink(`images/${filename}`,
          () => {
            models.Comment.destroy({
              where: {
                id: commentid,
              },
            })
              .then(() =>
                res.status(200).json({
                  message: "le post est bien supprimé !",
                })
              )
  
              .catch((error) =>
                res.status(400).json({
                  error,
                })
              );
          });
      }
      else {
        models.Comment.destroy({
          where: {
            id: commentid,
          },
        })
          .then(() =>
            res.status(200).json({
              message: "le post est bien supprimé !",
            })
          )
          .catch((error) =>
            res.status(400).json({
              error,
            })
          );
        
      }
    })
  }