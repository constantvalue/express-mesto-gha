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
      if (err.message === 'ValidationError') {

      }

      // ValidationError  -  это название ошибки
    });
};
