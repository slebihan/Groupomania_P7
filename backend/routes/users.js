const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const multer = require('../middleware/multer-config');


const userCtrl = require('../controllers/usersCtrl');

// Routes utilisateurs
router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.delete('/UserProfileEdit/:userId',auth,userCtrl.deleteAccount);
router.delete('/UserProfile/Admin/:userId',authAdmin,userCtrl.deleteAccountbyAdmin)
router.put('/UserProfileEdit/avatar/:userId',auth,multer,userCtrl.deleteImageProfil)   
router.get('/UserProfile/Admin',auth,userCtrl.getAllUsers)
router.get('/UserProfileEdit/:userId',auth,userCtrl.getOneUser)
router.post('/logout',userCtrl.logout)
router.put('/UserProfileEdit/:userId',auth,multer,userCtrl.updateUser)


module.exports = router