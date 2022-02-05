const ObjectId = require('mongodb').ObjectId;
const Concert = require('../models/concert.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Concert.find());
  } catch(err) {
    res.status(500).json({message: err});
  }
};

exports.getRandom = async (req, res, next) => {
  try {
    const count = await Concert.countDocuments();
    const randNum = Math.floor(Math.random() * count);
    const randItem = await Concert.findOne().skip(randNum);
    if(randItem) {
      res.json(randItem);
    } else {
      next();
    }
  } catch(err) {
    res.status(500).json({message: err});
  }
};

exports.getById = async (req, res, next) => {
  let itemFound;
  try {
    if(ObjectId.isValid(req.params.id)) {
      itemFound = await Concert.findById(req.params.id);
    }
    if(itemFound) {
      res.json(itemFound);
    } else {
      next();
    }
  } catch(err) {
    res.status(500).json({message: err});
  }
};

exports.postNewItem = async (req, res) => {
  const { performer, genre, image } = req.body;
  const price = Number(req.body.price);
  const day = Number(req.body.day);
  try {
    const newConcert = new Concert({ performer, genre, image, price, day });
    await newConcert.save();
    res.json({ message: 'OK' });
  } catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.putChanges = async (req, res, next) => {
  let itemFound;
  try {
    if(ObjectId.isValid(req.params.id)) {
      itemFound = await Concert.findById(req.params.id);
    }
    if(itemFound) {
      const { performer, genre, image } = req.body;
      const price = Number(req.body.price);
      const day = Number(req.body.day);
      itemFound.performer = performer;
      itemFound.genre = genre;
      itemFound.image = image;
      itemFound.price = price;
      itemFound.day = day;
      await itemFound.save();
      res.json({ message: 'OK' });
    } else {
      next();
    }
  } catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.deleteItem = async (req, res, next) => {
  let itemFound;
  try {
    if(ObjectId.isValid(req.params.id)) {
      itemFound = await Concert.findById(req.params.id);
    }
    if(itemFound) {
      await itemFound.remove();
      res.json({ message: 'OK' });
    } else {
      next();
    }
  } catch(err) {
    res.status(500).json({message: err});
  }
};
