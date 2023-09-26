// GET /cards — возвращает все карточки
// POST /cards — создаёт карточку
// DELETE /cards/:cardId — удаляет карточку по идентификатору

const router = require('express').Router();

const {
  getCards, addCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', addCard);

// router.delete('/:cardId', deleteCard);

module.exports = router;
