const ObjectId = require('mongodb').ObjectId;
const Concert = require('../models/concert.model');
const Seat = require('../models/seat.model');

const addTickets = (concert, seats) => {
  const seatsTaken = seats.filter(seat => concert.day === seat.day);
  const tickets = 50 - seatsTaken.length;  
  return {...concert._doc, tickets};
};

exports.getAll = async (req, res) => {
  try {
    const concerts = await Concert.find();
    const seats = await Seat.find();
    res.json(concerts.map(concert => addTickets(concert, seats)));
  } catch(err) {
    res.status(500).json({message: err});
  }
};

exports.getRandom = async (req, res, next) => {
  try {
    const count = await Concert.countDocuments();
    const randNum = Math.floor(Math.random() * count);
    const randItem = await Concert.findOne().skip(randNum);
    const seats = await Seat.find();
    if(randItem) {
      res.json(addTickets(randItem, seats));
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
      const seats = await Seat.find();
      res.json(addTickets(itemFound, seats));
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
