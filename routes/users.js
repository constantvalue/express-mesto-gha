// GET /users — возвращает всех пользователей
// GET /users/:userId - возвращает пользователя по _id
// POST /users — создаёт пользователя

const router = require('express').Router();

const { addUser } = require('../controllers/users');

// router.get('/users', getUsers);

// router.get('/users/:userId', getUser);

router.post('/', addUser);

module.exports = router;
