const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const booksCtrl = require('../controllers/books');

router.get('/', booksCtrl.getAllBooks);
router.get('/bestrating', booksCtrl.getBestRating);
router.get('/:id', booksCtrl.getOneBook);
router.post('/', auth, multer.uploadBookCover, multer.resizeBookCover, booksCtrl.createBook);
router.put('/:id', auth, multer.uploadBookCover, multer.resizeBookCover, booksCtrl.modifyBook);
router.post('/:id/rating', auth, booksCtrl.ratingBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router;
