const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnathorisedError = require('../errors/UnathorisedError');
const { regEx } = require('../constants');

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },

  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },

  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {

      // https://uibakery.io/regex-library/url
      validator: (v) => regEx.test(v),

      message: 'Это не ссылка',
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Это не email',
    },
  },

  password: {
    type: String,
    select: false,
    required: true,
  },

});

// взято из теории по спринту.
// переделал только обработку ошибок
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // throw new UnathorisedError(('Неправильные почта или пароль'));
        return Promise.reject(new UnathorisedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // throw new UnathorisedError(('Неправильные почта или пароль'));
            return Promise.reject(new UnathorisedError('Неправильные почта или пароль'));
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
