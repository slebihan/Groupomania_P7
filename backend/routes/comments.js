const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const commentsCtrl = require('../controllers/commentsCtrl');

router.post("/comments/",multer,commentsCtrl.createComment);
router.get("/comments/",commentsCtrl.getAllComments);
router.delete("/comments/:id",auth,commentsCtrl.deleteComment)



module.exports = router