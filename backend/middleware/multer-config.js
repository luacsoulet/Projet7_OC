const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const compressImage = async (imageName) => {
    const imagePath = path.join(__dirname, '../illustrations/', imageName);

    try {
        // Read the image from the specified directory
        const inputBuffer = await fs.readFile(imagePath);

        // Compress the image with sharp
        const compressedBuffer = await sharp(inputBuffer)
            .jpeg({ quality: 80 }) // Set quality to 80% for JPEG images
            .toBuffer();

        // Save the compressed image back to the same directory
        await fs.writeFile(imagePath, compressedBuffer);

        console.log(`Image ${imageName} compressed and saved successfully.`);
    } catch (error) {
        console.error(`Error compressing image ${imageName}: ${error.message}`);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'illustrations');
    },
    filename: async (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        const ref = name.replace(`.${extension}`, '') + Date.now() + '.' + extension;
        compressImage(ref);
        callback(null, ref);
    }
});

module.exports = multer({ storage: storage }).single('image');


