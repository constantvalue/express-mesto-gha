const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const {
  CREATED,
} = require('../constants');

// получаем всех юзеров
module.exports.getUsers = (req, res, next) => {
  User.find({})
  // res.send по умолчанию имеет status(200)
    .then((users) => res.send({ data: users }))
    // ловим ошибки если сервер пятисотит
    .catch(next);
};

// получаем только себя
module.exports.getUsersMe = (req, res, next) => {
  User.findById(req.user._id)
  // res.send по умолчанию имеет status(200)
    .then((user) => res.send({ data: user }))
    // ловим ошибки если сервер пятисотит
    .catch(next);
};

module.exports.addUser = (req, res, next) => {
  const {
    name, about, avatar, password, email,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, password: hash, email,
    }))
    .then((user) => res.status(CREATED)
      .send({
      // res.send({ data: user })) - такой подход вызывает ошибки при проверке эндпоинтов.
      // поэтому с помощью деструктуризации отправляю все кроме пароля.
        email: user.email, name: user.name, about: user.about, avatar: user.avatar,

      }))
    .catch((err) => {
      // ValidationError  -  это имя ошибки. Получил её с помощью console.log
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректный запрос'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегестрирован'));
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

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен (срок действия по брифу - 7 дней)
      const token = jwt.sign({ _id: user._id }, 'top_secret', { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      // res
      //   .status(401)
      //   .send({ message: err.message });
      next(err);
    });
};
