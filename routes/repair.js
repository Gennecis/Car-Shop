const express = require('express');
const router = express.Router();

const repairController = require('../controllers/repair');
const validation = require('../middleware/validate');
const { isAuthenticated } = require("../middleware/authenticate");

router.get('/', repairController.getAll);
router.get('/:id', repairController.getSingle);

if (process.env.NODE_ENV === "test") {
  router.post('/', repairController.createCar);
  router.put('/:id', repairController.updateCar);
  router.delete('/:id', repairController.deleteCar);
} else {
  router.post('/', isAuthenticated, validation.saveRepair, repairController.createCar);
  router.put('/:id', isAuthenticated, validation.saveRepair, repairController.updateCar);
  router.delete('/:id', isAuthenticated, repairController.deleteCar);
}

module.exports = router;