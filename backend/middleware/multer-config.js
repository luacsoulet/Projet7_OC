const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'illustrations');
    },
    filename: async (req, file, callback) => {
        const name = file.originalname.split(' ').join('-');
        const extension = MIME_TYPES[file.mimetype];
        const ref = name.replace(`.${extension}`, '') + Date.now() + '.' + extension;
        callback(null, ref);
    }
});

module.exports = multer({ storage: storage }).single('image');


