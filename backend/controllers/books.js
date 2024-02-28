const { log } = require('console');
const Book = require('../models/book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/illustrations/${req.file.filename}`
    });

    book.save()
        .then(() => { res.status(201).json({ message: 'Livre enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({
        _id: req.params.id
    }).then(
        (book) => {
            res.status(200).json(book);
        }
    ).catch(
        (error) => {
            res.status(401).json({
                error: error
            });
        }
    );
};

exports.getBestRating = (req, res, next) => {
    Book.find()
        .then((books) => {
            const bestRatings = books.sort((a, b) => b.averageRating - a.averageRating).slice(0, 3);
            res.status(200).json(bestRatings)
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.ratingBook = (req, res, next) => {
    const ratingGrade = JSON.parse(req.body.rating);
    console.log(ratingGrade);
    delete ratingGrade._id;
    Book.findOne({
        _id: req.params.id
    })
        .then((book) => {
            const userIsExist = book.ratings.find((rating) => rating.userId === req.auth.userId);
            console.log(userIsExist);
            if (!userIsExist) {
                book.ratings.push({
                    userId: req.auth.userId,
                    grade: ratingGrade
                })
                    .then(() => res.status(200).json(book))
                    .catch(error => res.status(401).json({ error }));
            } else {
                res.status(401).json({ message: 'User already rating' });
            }
        })
        .catch(error => res.status(401).json({ error }));
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/illustrations/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = book.imageUrl.split('/illustrations/')[1];
                fs.unlink(`illustrations/${filename}`);
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Livre modifié !' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = book.imageUrl.split('/illustrations/')[1];
                fs.unlink(`illustrations/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: 'Livre supprimé !' })
                        })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

exports.getAllBooks = (req, res, next) => {
    Book.find().then(
        (books) => {
            res.status(200).json(books);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}