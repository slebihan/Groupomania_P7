const models = require("../models");
const fs = require('fs');


exports.createPost = (req, res, next) => {

  console.log(req.file)
  if (!req.body.title) {
    res.status(400).send({
      message: "merci de saisir un titre !",
    });
  } else if (!req.body.content) {
    res.status(400).send({
      message: "merci de saisir un contenu !",
    });
  } else {
    models.Message.create({
      UserId: req.body.UserId,
      title: req.body.title,
      content: req.body.content,
      attachment: req.file ?`${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`: null,
    })
      .then(() =>
        res.status(201).json({
          message: "message publié !",
        })
      )
      .catch((error) =>
        res.status(400).json({
          error,
        })
      );
  }
};

exports.getAllposts = async (req, res, next) => {
  await models.Message.findAll({
    order : [['createdAt','DESC']],
    include: [
      { model: models.Like },
      { model: models.Dislike },
      { model : models.Comment },
      {model : models.User}
    ]
  })
    .then((success) => res.status(200).json(success))
    .catch((error) => res.status(500).json({ error }));
};

exports.getOnePost = async (req,res,next) =>{
  const commentid = req.params.id;
  await models.Message.findOne({where : { id : commentid}})
    .then((success) => res.status(200).json(success))
    .catch((error) => res.status(500).json({ error }));
}

exports.like = async (req, res, next) => {

  const message_id = req.params.id;
  const userId = req.body.userId
  console.log(userId)
  console.log(message_id)

  const dislikeFound = await models.Dislike.findOne({
    where : {
      MessageId: message_id,
      UserId: userId,
    }
  })
  const likeFound = await models.Like.findOne({
    where : {
      MessageId: message_id,
      UserId: userId,
    }
  })

  if(likeFound){
    console.log('likefound')
    models.Like.destroy({
      where :{
      MessageId: message_id,
      UserId: userId,
      }
    })
    models.Message.decrement('likes',{by : 1,where : {id : message_id}})
    .then(() =>
          res.status(200).json({
            message: "Vous n'aimez plus ce message !",
          })
    )
    
  }
  else if(!likeFound && !dislikeFound){

    console.log('bis')
    models.Like.create({
      MessageId: message_id,
      UserId: userId,
    })
    
    models.Message.increment('likes',{by : +1,where : {id : message_id}})
  .then(() =>
          res.status(200).json({
            message: "Like ajouté !",
          })
    )

  }
  else if(!likeFound && dislikeFound)
    { 
      console.log(true,'!likefound et !dislikefound')
      
      models.Like.create({
        MessageId: message_id,
        UserId: userId,
      })
      models.Dislike.destroy({
        where: {
          MessageId: message_id,
          UserId: userId,
        },
      });
  
      models.Message.increment('likes',{by : +1,where : {id : message_id}})
      models.Message.decrement('dislikes',{by :1,where : {id : message_id}})
      .then(() =>
      res.status(200).json({
        message: "Vous aimez ce message !",
      })
      )
      
    }
   
};

exports.unlike = async (req, res, next) => {
  const message_id = req.params.id;
  const userId = req.body.userId


  const dislikeFound = await models.Dislike.findOne({
    where : {
      MessageId: message_id,
      UserId: userId,
    }
  })
  const likeFound = await models.Like.findOne({
    where : {
      MessageId: message_id,
      UserId: userId,
    }
  })

  if(dislikeFound){

    console.log('dislikeFound')
    models.Dislike.destroy({
      where: {
        MessageId: message_id,
        UserId: userId,
      },
    });
    models.Message.decrement('dislikes',{by : 1,where : {id : message_id}})
    .then(() =>
      res.status(200).json({
        message: "Dislike retiré !",
      })
      )
    

  }
  else if(!dislikeFound && !likeFound){
    console.log('!dislikeFound && !likeFound')
    models.Dislike.create({
      MessageId: message_id,
      UserId: userId,
    })

    models.Message.increment('dislikes',{by : +1,where : {id : message_id}})
    .then(() =>
      res.status(200).json({
        message: "Dislike ajouté !",
      })
      )

  }
  else if(!dislikeFound && likeFound)
    { 
      console.log(true,'!likefound et !dislikefound')
      
      models.Dislike.create({
        MessageId: message_id,
        UserId: userId,
      })
      models.Like.destroy({
        where: {
          MessageId: message_id,
          UserId: userId,
        },
      });
  
      models.Message.increment('dislikes',{by : +1,where : {id : message_id}})
      models.Message.decrement('likes',{by : 1,where : {id : message_id}})
      .then(() =>
      res.status(200).json({
        message: "Vous n'aimez plus ce message !",
      })
      )
      
    }
  }
  
  


exports.deleteMessage = async (req, res, next) => {

  const message_id = req.params.id;
  
  
  models.Message.findOne({ where : { id : message_id}})
  .then(message => {
    if (message.attachment !== null) {

      const filename = message.attachment.split("/images/")[1];
      fs.unlink(`images/${filename}`,
        () => {
          models.Message.destroy({
            where: {
              id: message_id,
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
      models.Message.destroy({
        where: {
          id: message_id,
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



//   models.Message.findOne({ where: { id: message_id } })
//     .then((message) => {
//     //   if (req.file) {
//     //     const filename = post.imageUrl.split("/images/")[1];
//     //     fs.unlink(`images/${filename}`, () => {
//     //       post
//     //         .destroy({
//     //           where: {
//     //             id: req.params.id,
//     //           },
//     //         })
//     //         .then(() =>
//     //           res.status(200).json({
//     //             message: "le post est bien supprimé !",
//     //           })
//     //         )
//     //         .catch((error) =>
//     //           res.status(400).json({
//     //             error,
//     //           })
//     //         );
//     //     });
//     //   }
//     // })

//       if(message.attachment !== undefined){
//       const filename = message.attachment.split('/images/')[1]
//       console.log(filename)
//       fs.unlink(`images/${filename}`),() =>  {

//       models.Message.destroy({
//         where: {
//           id: message_id,
//         }
//       })
//       .then(() => res.status(200).json({
//         message: 'le post est bien supprimé !'
//     }))
//     .catch(error => res.status(400).json({
//         error
//     }))
//     }
//       }
//       else {
//         models.Message.destroy({
//           where: {
//             id: message_id,
//           }
//         })
//     .then(() =>
//       res.status(200).json({
//         message: "le post est bien supprimé !",
//       })
//     )
//     .catch((error) =>
//       res.status(400).json({
//         error,
//       })
//     );
//     }
//   })
//   .catch(error => res.status(400).json({error}))
//   // console.log(message.attachment.split('/images/')[1])

//   // .then ((message)=> {

//   // } )
//   // .then(() =>
//   //   res.status(200).json({
//   //     message: "Publication supprimée",
//   //   })
//   // );
// };;

exports.modifyMessage = (req, res, next) => {

  const title = req.body.body.title
  const content = req.body.body.content;
  console.log(req.body.body.content);
  const message_id = req.params.id;
  console.log(message_id);

  models.Message.update({ content: content,title : title }, { where: { id: message_id } })
    .then(() => res.status(200).json({ message: "Publication modifiée avec succès" }))
    .catch((error) =>
      res.status(400).json({ message: "Impossible de modifier ce post" })
    )
};


exports.getLikes = async (req,res,next) => {
  await models.Like.findAll()
    .then((success) => res.status(200).json(success))
    .catch((error) => res.status(500).json({ error }));

}
exports.getDislikes = async (req,res,next) => {
  await models.Dislike.findAll()
    .then((success) => res.status(200).json(success))
    .catch((error) => res.status(500).json({ error }));

}
