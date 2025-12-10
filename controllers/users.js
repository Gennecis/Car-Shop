const { response } = require("express");
const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  //#swagger.tags=["Users"]
  try {
    const lists = await mongodb
      .getDatabase()
      .db("CarShop")
      .collection("users")
      .find()
      .toArray();

    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getSingle = async (req, res) => {
  //#swagger.tags=["Users"]

  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Must use a valid user id to find a contact.' });
  }

  try {
    const userId = new ObjectId(req.params.id);

    const result = await mongodb
      .getDatabase()
      .db("CarShop")
      .collection("users")
      .findOne({ _id: userId });

    if (!result) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createUser = async (req, res) => {
  const user = {
    email: req.body.email,
    username: req.body.username,
    name: req.body.name,
    ipaddress: req.body.ipaddress,
  };

  try {
    const response = await mongodb
      .getDatabase()
      .db("CarShop")
      .collection("users")
      .insertOne(user);

    if (response.acknowledged) {
      return res.status(201).json({ insertedId: response.insertedId });
    }

    return res.status(500).json({ message: "User creation not acknowledged." });

  } catch (err) {
    return res.status(500).json({
      message: err.message || "Some error occurred while creating the User"
    });
  }
};

const updateUser = async (req, res) => {
  //#swagger.tags=["Users"]

  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Must use a valid user id to update a user.' });
  }

  const userId = new ObjectId(req.params.id);
  const user = {
    email: req.body.email,
    username: req.body.username,
    name: req.body.name,
    ipaddress: req.body.ipaddress,
  };

  try {
    const response = await mongodb.getDatabase().db("CarShop").collection("users").replaceOne({ _id: userId }, user);
    if (response.modifiedCount > 0) {
      return res.status(204).send();
    }
    return res.status(404).json({ message: 'User not found or no changes applied.' });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Some error occurred while updating the User"
    });
  }
};

const deleteUser = async (req, res) => {
  //#swagger.tags=["Users"]

  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Must use a valid user id to delete a user.' });
  }

  const userId = new ObjectId(req.params.id);

  try {
    const response = await mongodb.getDatabase().db("CarShop").collection("users").deleteOne({ _id: userId });
    if (response.deletedCount > 0) {
      return res.status(204).send();
    }
    return res.status(404).json({ message: 'User not found.' });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Some error occurred while deleting the User"
    });
  }
};

module.exports = { getAll, getSingle, createUser, updateUser, deleteUser };