// GET /users — возвращает всех пользователей
// GET /users/:userId - возвращает пользователя по _id
// POST /users — создаёт пользователя

const router = require('express').Router();

const { addUser, getUsers, getUserById } = require('../controllers/users');

router.get('/', getUsers);

router.post('/', addUser);

router.get('/:userId', getUserById);


module.exports = router;
