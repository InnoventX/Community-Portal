const multer = require('multer');
const uuid = require('uuid');

// It's the types given by MULTER so we rapup the extensions with it
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const fileUpload = multer({
    limit: 500000,

    storage: multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null , 'uploads/images');
        },
        filename: (req,file,cb) => {
            const extension = MIME_TYPE_MAP[file.mimetype];
            cb(null , uuid.v4()+'.'+extension);
        }
    }),

    fileFilter: (req,file,cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        const error = isValid ? null : new Error('Invalid mime type');
        cb(error,isValid);
    }
});

module.exports = fileUpload;