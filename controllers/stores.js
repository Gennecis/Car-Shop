const { response } = require("express");
const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  //#swagger.tags=["Stores"]
  try {
    const lists = await mongodb
      .getDatabase()
      .db("CarShop")
      .collection("store")
      .find()
      .toArray();

    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags=["Stores"]

  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Must use a valid store id to find a store.' });
  }

  try {
    const storeId = new ObjectId(req.params.id);

    const result = await mongodb
      .getDatabase()
      .db("CarShop")
      .collection("store")
      .findOne({ _id: storeId });

    if (!result) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createStore = async (req, res) => {
  //#swagger.tags=["Stores"]
  const store = {
    name: req.body.name,
    manager: req.body.manager,
    number: req.body.number,
  };

  try {
    const response = await mongodb
      .getDatabase()
      .db("CarShop")
      .collection("store")
      .insertOne(store);

    if (response.acknowledged) {
      return res.status(201).json({ insertedId: response.insertedId });
    }

    return res.status(500).json({ message: "Store creation not acknowledged." });

  } catch (err) {
    return res.status(500).json({
      message: err.message || "Some error occurred while creating the Store",
    });
  }
};

async function updateStore(req, res) {
  //#swagger.tags=["Stores"]
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Must use a valid store id when updating." });
  }
  const StoreId = new ObjectId(req.params.id);
  const store = {
    name: req.body.name,
    manager: req.body.manager,
    number: req.body.number,
  };
  try {
    const response = await mongodb
      .getDatabase()
      .db("CarShop")
      .collection("store")
      .replaceOne({ _id: StoreId }, store);
    if (response.modifiedCount > 0) {
      return res.status(204).send();
    }
    return res.status(404).json({ message: "Store not found or no changes applied." });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Some error occurred while updating the Store" });
  }
}

const deleteStore = async (req, res) => {
  //#swagger.tags=["Stores"]

  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Must use a valid store id to delete a store.' });
  }

  const storeId = new ObjectId(req.params.id);

  try {
    const response = await mongodb.getDatabase().db("CarShop").collection("store").deleteOne({ _id: storeId });
    if (response.deletedCount > 0) {
      return res.status(204).send();
    }
    return res.status(404).json({ message: 'Store not found.' });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Some error occurred while deleting the Store" });
  }
};
module.exports = { getAll, getSingle, createStore, updateStore, deleteStore };