const router = require('express').Router();
const { getAll, getRandom, getById, postNewItem, putChanges, deleteItem } = require('../controllers/testimonials.controller');

router.route('/').get(getAll);
router.route('/random').get(getRandom);
router.route('/:id').get(getById);
router.route('/').post(postNewItem);
router.route('/:id').put(putChanges);
router.route('/:id').delete(deleteItem);

module.exports = router;
