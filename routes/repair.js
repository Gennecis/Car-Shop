const express = require('express');
const router = express.Router();

const repairController = require('../controllers/repair');
const validation = require('../middleware/validate');
const { isAuthenticated } = require("../middleware/authenticate");

router.get('/', repairController.getAll);
router.get('/:id', repairController.getSingle);
router.put('/:id', isAuthenticated, validation.saveRepair, repairController.updateCar);
router.delete('/:id', isAuthenticated, repairController.deleteCar);

if (process.env.NODE_ENV === "test") {
  router.post('/', repairController.createCar);
} else {
  router.post('/', isAuthenticated, validation.saveCar, repairController.createCar);
}

module.exports = router;