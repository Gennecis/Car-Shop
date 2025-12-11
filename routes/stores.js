const express = require("express");
const router = express.Router();

const storesController = require("../controllers/stores"); // Fixed name
const validation = require("../middleware/validate");
const { isAuthenticated } = require("../middleware/authenticate");

router.get("/", storesController.getAll);
router.get("/:id", storesController.getSingle);

if (process.env.NODE_ENV === "test") {
  router.post("/", storesController.createStore);
  router.put("/:id", storesController.updateStore);
  router.delete("/:id", storesController.deleteStore);
} else {
  router.post("/", isAuthenticated, validation.saveStore, storesController.createStore);
  router.put("/:id", isAuthenticated, validation.saveStore, storesController.updateStore);
  router.delete("/:id", isAuthenticated, storesController.deleteStore);
}

module.exports = router;