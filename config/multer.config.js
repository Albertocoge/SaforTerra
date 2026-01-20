const cloudinary = require('cloudinary').v2;
const CloudinaryStorage = require('multer-storage-cloudinary').CloudinaryStorage;
const multer = require('multer');
// Configuro cloudinary con las api keys que me dan en el panel de control
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Configuramos cloudinary y multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'farm2fork',
    allowedFormats: ['jpg', 'png', 'webp'],
  },
});
// Exportamos la instancia de multer configurada para usarla en las rutas
module.exports = multer({ storage: storage })