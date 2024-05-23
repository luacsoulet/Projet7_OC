const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const multerStorage = multer.memoryStorage();

const upload = multer({
    storage: multerStorage
});

exports.uploadBookCover = upload.single('image');

exports.resizeBookCover = async(req, res, next) => {

    const imagesFolder = './illustrations';

    if (!fs.existsSync(imagesFolder)) {
        fs.mkdirSync(imagesFolder);
    };

    if (!req.file) return next();

    console.log(req.file);
    console.log(JSON.parse(req.body.book))
    const originalName = req.file.originalname.split(' ').join('-').replace(/\.[^/.]+$/, "");

    const date = new Date(Date.now()).getMinutes();

    const coverName = `${originalName}-${date}-cover.webp`;

    req.body.book.imageUrl = `${req.protocol}://${req.get('host')}/ilustrations/${coverName}`;

    console.log(req.body.book.imageUrl);

    await sharp(req.file.buffer)
        .toFormat('webp')
        .webp({ quality: 75 })
        .toFile(`${imagesFolder}/${coverName}`);

    next();
};