const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config')

const messageCtrl = require('../controllers/messagesCtrl');
const auth = require('../middleware/auth')



router.post("/messages",multer,messageCtrl.createPost);
router.get("/messages",messageCtrl.getAllposts);
router.get("/messages/:id",messageCtrl.getOnePost);
router.get("/messages/like",messageCtrl.getLikes)
router.get("/messages/unlike",messageCtrl.getDislikes)
router.post("/messages/:id/like",messageCtrl.like);
router.post("/messages/:id/unlike",messageCtrl.unlike)
router.delete("/messages/:id",auth,messageCtrl.deleteMessage)
router.put("/messages/:id",auth,messageCtrl.modifyMessage)

module.exports = router