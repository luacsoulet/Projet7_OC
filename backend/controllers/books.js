const Book = require('../models/book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const date = new Date(Date.now()).getMinutes();
    const originalName = req.file.originalname.split(' ').join('-').replace(/\.[^/.]+$/, "");
    const book = new Book({
        ...bookObject,
        imageUrl: `${req.protocol}://${req.get('host')}/illustrations/${originalName}-${date}-cover.webp`,
        userId: req.auth.userId,
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

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            const userId = req.auth.userId;
            const ratings = book.ratings;
            if (ratings.some((rating) => rating.userId === userId)) {
                return res.status(400).json({ message: 'You have already rated this book' });
            }
            const newRating = {
                userId: userId,
                grade: req.body.rating
            };

            ratings.push(newRating);

            const sum = ratings.reduce((total, rating) => (total += rating.grade), 0);
            const averageRating = sum / ratings.length;
            book.ratings = ratings;
            book.averageRating = averageRating;

            book.save();
            res.send(book);
        })
        .catch((error) => res.status(400).json({ error }));

};

exports.modifyBook = (req, res, next) => {
    const date = new Date(Date.now()).getMinutes();

    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/illustrations/${req.file.originalname.split(' ').join('-').replace(/\.[^/.]+$/, "")}-${date}-cover.webp`
    } : { ...req.body };

    const BookUpdate = () => {
        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Livre modifié !' }))
            .catch(error => res.status(401).json({ error }));
    };

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: '403: unauthorized request' });
            } else {
                if (req.file) {
                    const filename = book.imageUrl.split('/illustrations/')[1];
                    fs.unlink(`illustrations/${filename}`, () => BookUpdate());
                } else {
                    BookUpdate();
                }
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
                res.status(401).json({ message: '403: unauthorized request' });
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
    Book.find()
        .then(
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