// GET /users — возвращает всех пользователей
// GET /users/:userId - возвращает пользователя по _id
// POST /users — создаёт пользователя

const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const { regEx } = require('../constants');

const {
  getUsers, getUserById, updateAvatar, updateProfile, getUsersMe,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUsersMe);

// router.post('/', addUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regEx),
  }),
}), updateAvatar);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

module.exports = router;
