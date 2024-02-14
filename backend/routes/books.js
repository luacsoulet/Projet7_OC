const express = require('express');
const router = express.Router();

const booksCtrl = require('../controllers/books');

router.get('/', booksCtrl.getAllBooks);
// router.post('/', booksCtrl.createBook);
// router.get('/:id', booksCtrl.getOneBook);
// router.get('/bestrating', booksCtrl.getBestRating);
// router.put('/:id', booksCtrl.modifyBook);
// router.put('/:id/rating', booksCtrl.ratingBook);
// router.delete('/:id', booksCtrl.deleteBook);

module.exports = router;