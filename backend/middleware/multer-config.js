const multer = require('multer');
const sharp = require('sharp');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

let ref;

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'illustrations');
    },
    filename: async (req, file, callback) => {
        const name = file.originalname.split(' ').join('-');
        const extension = MIME_TYPES[file.mimetype];
        ref = name.replace(`.${extension}`, '') + Date.now() + '.' + extension;
        compressedImage(ref);
        callback(null, ref);
    }
});

const compressedImage = async (imgName) => {
    const extensionOfImage = imgName.indexOf('.', imgName.indexOf('.') + 1);

    const ImageName = imgName.substring(0, extensionOfImage + 1);

    const newImageName = ImageName + '.webp';
    await sharp('./illustrations/' + imgName)
        .toFormat('webp', { palette: true })
        .toFile(__dirname + '/compressed_illustrations/' + newImageName);
};

module.exports = multer({ storage: storage }).single('image');


