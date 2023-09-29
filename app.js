const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const { celebrate, errors, Joi } = require('celebrate');
const { addUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { regEx } = require('./constants');

const { NOT_FOUND } = require('./constants');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// эти роуты не требуют защиты авторизацией.

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    avatar: Joi.string().pattern(regEx),
  }),
}), addUser);

// app.post('/signin', login);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);

// все что идет после этого мидлвара - будет защищено авторизацией
app.use(auth);

// роуты для юзерконтроллера
app.use('/users', require('./routes/users'));

// роуты для кардконтроллера
app.use('/cards', require('./routes/cards'));

// последний эндпоинт тест. Обработка несуществующего пути.
app.use('/*', (req, res) => res.status(NOT_FOUND).send({ message: 'Страница не существуею' }));

// обрабатываем ошибки которые генерирует celebrate.
// Этот метод вернет тело ошибки с указанием причины ошибки валидации.
app.use(errors());

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);

// 6511771048b240115a033721
