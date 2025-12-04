const express = require('express');
const router = express.Router();

const usersController = require('../controllers/stores');

router.get('/', usersController.getAll);
router.get('/:id', usersController.getSingle);
router.post('/', usersController.createStore);
router.put('/:id', usersController.updateStore);
router.delete('/:id', usersController.deleteStore);

module.exports = router;