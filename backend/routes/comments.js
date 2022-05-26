const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config')
const commentsCtrl = require('../controllers/commentsCtrl');

router.post("/comments/",multer,commentsCtrl.createComment);
router.get("/comments/",multer,commentsCtrl.getAllComments);
router.delete("/comments/:id",commentsCtrl.deleteComment)



module.exports = router