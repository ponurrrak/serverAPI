const ObjectId = require('mongodb').ObjectId;
const sanitize = require('mongo-sanitize');
const Seat = require('../models/seat.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Seat.find());
  } catch(err) {
    res.status(500).json({message: err});
  }
};

exports.getRandom = async (req, res, next) => {
  try {
    const count = await Seat.countDocuments();
    const randNum = Math.floor(Math.random() * count);
    const randItem = await Seat.findOne().skip(randNum);
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
      itemFound = await Seat.findById(req.params.id);
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
  const client = sanitize(req.body.client);
  const email = sanitize(req.body.email);  
  const seat = Number(sanitize(req.body.seat));
  const day = Number(sanitize(req.body.day));
  try {
    const isBooked = await Seat.findOne({ seat, day });
    if(!isBooked) {
      const newSeat = new Seat({ day, seat, client, email });
      await newSeat.save();
      req.io.emit('seatsUpdated', await Seat.find());
      res.json({ message: 'OK' });
    } else {
      res.status(409).json({message: 'The seat is already taken...'});
    }
  } catch(err) {
    res.status(500).json({message: err});
  }
};

exports.putChanges = async (req, res, next) => {
  let itemFound;
  try {
    if(ObjectId.isValid(req.params.id)) {
      itemFound = await Seat.findById(req.params.id);
    }
    if(itemFound) {
      const { client, email } = req.body;
      const seat = Number(req.body.seat);
      const day = Number(req.body.day);
      const isBooked = await Seat.findOne({ seat, day });
      if(!isBooked) {
        itemFound.seat = seat;
        itemFound.day = day;
        itemFound.client = client;
        itemFound.email = email;
        await itemFound.save();
        res.json({ message: 'OK' });
      } else {
        res.status(409).json({message: 'The seat is already taken...'});
      }
    } else {
      next();
    }
  } catch(err) {
    res.status(500).json({message: err});
  }
};

exports.deleteItem = async (req, res, next) => {
  let itemFound;
  try {
    if(ObjectId.isValid(req.params.id)) {
      itemFound = await Seat.findById(req.params.id);
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
