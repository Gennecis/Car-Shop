// cars.controller.js
const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;


async function getAll(req, res) {
  //#swagger.tags=["Cars"]
  try {
    const lists = await mongodb
      .getDatabase()
      .db("CarShop")
      .collection("Cars")
      .find()
      .toArray();
    return res.status(200).json(lists);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getSingle(req, res) {
  //#swagger.tags=["Cars"]
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Must use a valid car id when searching." });
  }
  try {
    const carId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db("CarShop")
      .collection("Cars")
      .findOne({ _id: carId });
    if (!result) {
      return res.status(404).json({ message: "Car not found." });
    }
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function createCar(req, res) {
  //#swagger.tags=["Cars"]
  const car = {
    carName: req.body.carName,
    brand: req.body.brand,
    year: req.body.year,
    color: req.body.color,
    price: req.body.price
  };
  try {
    const response = await mongodb
      .getDatabase()
      .db("CarShop")
      .collection("Cars")
      .insertOne(car);
    if (response.acknowledged) {
      return res.status(201).json({ insertedId: response.insertedId });
    }
    return res.status(500).json({ message: "Car creation not acknowledged." });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Some error occurred while creating the car" });
  }
}

async function updateCar(req, res) {
  //#swagger.tags=["Cars"]
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Must use a valid car id when updating." });
  }
  const carId = new ObjectId(req.params.id);
  const car = {
    carName: req.body.carName,
    brand: req.body.brand,
    year: req.body.year,
    color: req.body.color,
    price: req.body.price
  };
  try {
    const response = await mongodb
      .getDatabase()
      .db("CarShop")
      .collection("Cars")
      .replaceOne({ _id: carId }, car);
    if (response.modifiedCount > 0) {
      return res.status(204).send();
    }
    return res.status(404).json({ message: "Car not found or no changes applied." });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Some error occurred while updating the car" });
  }
}

async function deleteCar(req, res) {
  //#swagger.tags=["Cars"]
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Must use a valid car id when deleting." });
  }
  const carId = new ObjectId(req.params.id);
  try {
    const response = await mongodb
      .getDatabase()
      .db("CarShop")
      .collection("Cars")
      .deleteOne({ _id: carId });
    if (response.deletedCount > 0) {
      return res.status(204).send();
    }
    return res.status(404).json({ message: "Car not found." });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Some error occurred while deleting the car" });
  }
}

module.exports = {
  getAll,
  getSingle,
  createCar,
  updateCar,
  deleteCar
};
