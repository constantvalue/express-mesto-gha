
//эту мидлвару взял из теории по спринту.

const jwt = require('jsonwebtoken');
const UnathorisedError = require('../errors/UnathorisedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnathorisedError(('Авторизуйтесь'))
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'top_secret');
  } catch (err) {
    throw new UnathorisedError(('Авторизуйтесь'))
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};