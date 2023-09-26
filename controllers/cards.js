const Card = require('../models/card');

const {
  SERVER_FAILURE, BAD_REQUEST, NOT_FOUND, CREATED,
} = require('../constants');

module.exports.getCards = (req, res) => {
  Card.find({})
  // res.send по умолчанию имеет status(200)
    .then((cards) => res.send({ data: cards }))
    // ловим ошибки если сервер пятисотит
    .catch(() => res.status(SERVER_FAILURE).send({ message: 'Произошла ошибка' }));
};

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  const likes = [];
  Card.create({
    name, link, owner: req.user._id, likes,
  })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      // ValidationError  -  это имя ошибки. Получил её с помощью console.log
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный запрос' });
      }

      return res.status(SERVER_FAILURE).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Нет карточки с таким id' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный запрос' });
      }

      return res.status(SERVER_FAILURE).send({ message: 'Произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Нет карточки с таким id' });
    }
    return res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Некорректный запрос' });
    }

    return res.status(SERVER_FAILURE).send({ message: 'Произошла ошибка' });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Нет карточки с таким id' });
    }
    return res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Некорректный запрос' });
    }

    return res.status(SERVER_FAILURE).send({ message: 'Произошла ошибка' });
  });
