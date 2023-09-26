const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// хардкод мидлвейр из брифа
app.use((req, res, next) => {
  req.user = {
    _id: '6511771048b240115a033721', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

// роуты для юзерконтроллера
app.use('/users', require('./routes/users'));

// роуты для кардконтроллера
app.use('/cards', require('./routes/cards'));

// последний эндпоинт тест. Обработка несуществующего пути.
app.use('/*', (req, res) => res.status(404).send({ message: 'Страница не существуею' }));

app.listen(PORT);

// 6511771048b240115a033721
