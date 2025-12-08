const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');
const validation = require('../middleware/validate');
const { isAuthenticated } = require("../middleware/authenticate");

router.get('/', usersController.getAll);
router.get('/:id', usersController.getSingle);
router.put('/:id', isAuthenticated, validation.saveUser, usersController.updateUser);
router.delete('/:id', isAuthenticated, usersController.deleteUser);

if (process.env.NODE_ENV === "test") {
  router.post('/', usersController.createUser);
} else {
  router.post('/', isAuthenticated, validation.saveUser, usersController.createUser);
}

module.exports = router;