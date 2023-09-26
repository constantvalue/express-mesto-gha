// GET /cards — возвращает все карточки
// POST /cards — создаёт карточку
// DELETE /cards/:cardId — удаляет карточку по идентификатору

const router = require('express').Router();

const {
  getCards, addCard, deleteCard, dislikeCard, likeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', addCard);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
