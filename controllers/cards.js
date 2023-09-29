const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const {
  CREATED,
} = require('../constants');

module.exports.getCards = (req, res, next) => {
  Card.find({})
  // res.send по умолчанию имеет status(200)
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      next(err);
    });
  // ловим ошибки если сервер пятисотит
};

module.exports.addCard = (req, res, next) => {
  const { name, link } = req.body;
  const likes = [];
  Card.create({
    name, link, owner: req.user._id, likes,
  })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      // ValidationError  -  это имя ошибки. Получил её с помощью console.log
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректный запрос'));
        return;
      }

      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
        // преобразуем объект в строковое представление
      } else if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Эта карточка вам не принадлежит');
      }
      // card.remove().then(res.send(card));
      return Card.findByIdAndRemove(req.params.cardId).then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный запрос'));
        return;
      }

      next(err);
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Нет карточки с таким id');
    }
    return res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Некорректный запрос'));
      return;
    }

    next(err);
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Нет карточки с таким id');
    }
    return res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Некорректный запрос'));
      return;
    }

    next(err);
  });
