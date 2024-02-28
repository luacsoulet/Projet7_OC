const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { log } = require('console');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// const compressImage = async (imageName) => {
//     const imagePath = path.join(__dirname, `./illustrations/${imageName}`);
//     console.log(imagePath);
//     try {
//         // Read the image from the specified directory
//         const inputBuffer = await fs.readFile(`./illustrations/${imageName}`);
//         console.log(imagePath);
//         console.log(inputBuffer);
//         // Compress the image with sharp
//         const compressedBuffer = await sharp(inputBuffer)
//             .jpeg({ quality: 50 }) // Set quality to 80% for JPEG images
//             .toBuffer();

//         // Save the compressed image back to the same directory
//         await fs.writeFile(imagePath, compressedBuffer);

//         console.log(`Image ${imageName} compressed and saved successfully.`);
//     } catch (error) {
//         console.error(`Error compressing image ${imageName}: ${error.message}`);
//     }
// };

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'illustrations');
    },
    filename: async (req, file, callback) => {
        const name = file.originalname.split(' ').join('-');
        const extension = MIME_TYPES[file.mimetype];
        const ref = name.replace(`.${extension}`, '') + Date.now() + '.' + extension;
        callback(null, ref);
        // compressImage(ref);
    }
});

module.exports = multer({ storage: storage }).single('image');


