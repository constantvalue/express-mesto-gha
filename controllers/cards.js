// ПОДСКАЗКИ ИЗ ТЕОРИИ ЯНДЕКСА (ИЗ БРИФА К ПР)

// module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
//   req.params.cardId,
//   { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
//   { new: true },
// )

// module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
//   req.params.cardId,
//   { $pull: { likes: req.user._id } }, // убрать _id из массива
//   { new: true },
// )

const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
  // res.send по умолчанию имеет status(200)
    .then((cards) => res.send({ data: cards }))
    // ловим ошибки если сервер пятисотит
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  const likes = [];
  Card.create({
    name, link, owner: req.user._id, likes,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      // ValidationError  -  это имя ошибки. Получил её с помощью console.log
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Некорректный запрос' });
      }

      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};
