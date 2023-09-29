const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const { addUser } = require('./controllers/users');

const { NOT_FOUND } = require('./constants');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// app.post('/signin', login);
app.post('/signup', addUser);

// роуты для юзерконтроллера
app.use('/users', require('./routes/users'));

// роуты для кардконтроллера
app.use('/cards', require('./routes/cards'));

// последний эндпоинт тест. Обработка несуществующего пути.
app.use('/*', (req, res) => res.status(NOT_FOUND).send({ message: 'Страница не существуею' }));

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
