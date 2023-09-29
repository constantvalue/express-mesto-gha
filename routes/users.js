// GET /users — возвращает всех пользователей
// GET /users/:userId - возвращает пользователя по _id
// POST /users — создаёт пользователя

const router = require('express').Router();

const {
  addUser, getUsers, getUserById, updateAvatar, updateProfile,
} = require('../controllers/users');

router.get('/', getUsers);

// router.post('/', addUser);

router.get('/:userId', getUserById);

router.patch('/me/avatar', updateAvatar);

router.patch('/me', updateProfile);

module.exports = router;
