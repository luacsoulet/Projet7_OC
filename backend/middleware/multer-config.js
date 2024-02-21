// const sharp = require("sharp");
const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'illustrations');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name.replace(`.${extension}`, '') + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage: storage }).single('image');

// const multer = require('multer');
// const sharp = require("sharp");

// const MIME_TYPES = {
//     'image/jpg': 'jpg',
//     'image/jpeg': 'jpg',
//     'image/png': 'png'
// };

// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, 'illustrations');
//     },
//     filename: (req, file, callback) => {
//         const name = file.originalname.split(' ').join('_');
//         const extension = MIME_TYPES[file.mimetype];
//         callback(null, name.replace(`.${extension}`, '') + Date.now() + '.' + extension);
//     }
// });

// const upload = multer({ storage: storage }).single('image');

// module.exports = (req, res) => {
//     upload(req, res, (err) => {
//         if (err) {
//             return res.status(400).json({ error: 'Image upload failed' });
//         }

//         if (!req.file) {
//             return res.status(400).json({ error: 'No image provided' });
//         }

//         let imagePath = req.file.path;
//         let imageExtension = req.file.filename.split('.').pop();

//         if (imageExtension === 'jpg' || imageExtension === 'jpeg') {
//             sharp(imagePath)
//                 .jpeg({ quality: 50 })
//                 .toFile(`illustrations/${req.file.filename}.jpg`, (err, info) => {
//                     if (err) {
//                         return res.status(500).json({ error: 'Image processing failed' });
//                     }

//                     return res.status(200).json({ message: 'Image uploaded and processed successfully' });
//                 });
//         } else if (imageExtension === 'png') {
//             sharp(imagePath)
//                 .png({ quality: 50 })
//                 .toFile(`illustrations/${req.file.filename}.png`, (err, info) => {
//                     if (err) {
//                         return res.status(500).json({ error: 'Image processing failed' });
//                     }

//                     return res.status(200).json({ message: 'Image uploaded and processed successfully' });
//                 });
//         } else {
//             return res.status(400).json({ error: 'Unsupported image format' });
//         }
//     });
// };