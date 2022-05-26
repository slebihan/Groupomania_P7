//Package permettant l'upload de fichier
const multer  = require('multer')

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
}

//Enregistrement du fichier sur le disque en choisissant le dossier de destination
const storage = multer.diskStorage({
destination : (req,file,callback) => {
    callback (null,'images')

},
//Création d'un fichier type afin d'éviter les doublons
filename: (req,file,callback) =>{ 
    const name = [file.originalname.split(' ')].join('_');
  
    const extension = MIME_TYPES[file.mimetype];
    callback(null,name + ('__') + Date.now() + '.' + extension)

},

})  

module.exports = multer({ storage }).single('attachment');