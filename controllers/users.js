const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const {
  SERVER_FAILURE, BAD_REQUEST, NOT_FOUND, CREATED,
} = require('../constants');

module.exports.getUsers = (req, res) => {
  User.find({})
  // res.send по умолчанию имеет status(200)
    .then((users) => res.send({ data: users }))
    // ловим ошибки если сервер пятисотит
    .catch(() => res.status(SERVER_FAILURE).send({ message: 'Произошла ошибка' }));
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      // ValidationError  -  это имя ошибки. Получил её с помощью console.log
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный запрос' });
      }

      return res.status(SERVER_FAILURE).send({ message: 'Произошла ошибка' });
    });
};

module.exports.getUserById = (req, res, next) => {
  User
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.send({ data: user });
      }
      // send по дефолту имеет statuscode 200
    })
    .catch((err) => {

      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный запрос');
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  }, { new: true, runValidators: true }).then((user) => {
    if (!user) {
      res.status(NOT_FOUND).send({ message: 'Пользователь с таким Id не найден' });
    } else {
      res.send({ data: user });
    }
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный запрос' });
      }
      return res.status(SERVER_FAILURE).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateProfile = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    about: req.body.about,
  }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с таким Id не найден' });
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный запрос' });
      }

      return res.status(SERVER_FAILURE).send({ message: 'Произошла ошибка' });
    });
};
