const User = require('../models/user');

// этот контроллер тупо копипаста из тренажера. Поменял только текст ошибки и переменную directors поменял на users.
module.exports.getUsers = (req, res) => {
  User.find({})
  // res.send по умолчанию имеет status(200)
    .then((users) => res.send({ data: users }))
    // ловим ошибки если сервер пятисотит
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      // ValidationError  -  это название ошибки. Получил её с помощью console.log
      if (err.message === 'ValidationError') {

      }


    });
};

module.exports.getUserById = (req, res) => {
  User
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с таким Id не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch(() => {
      res.status(404).send({ message: 'Пользователь с таким Id не найден' });
    });
};
