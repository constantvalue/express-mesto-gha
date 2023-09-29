const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const {
  CREATED,
} = require('../constants');

module.exports.getUsers = (req, res, next) => {
  User.find({})
  // res.send по умолчанию имеет status(200)
    .then((users) => res.send({ data: users }))
    // ловим ошибки если сервер пятисотит
    .catch(next);
};

module.exports.addUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      // ValidationError  -  это имя ошибки. Получил её с помощью console.log
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректный запрос'));
      }

      next(err);
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
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный запрос'));
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  }, { new: true, runValidators: true }).then((user) => {
    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    } else {
      res.send({ data: user });
    }
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректный запрос'));
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    about: req.body.about,
  }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }

      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректный запрос'));
      }

      next(err);
    });
};
