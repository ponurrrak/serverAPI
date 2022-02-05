const ObjectId = require('mongodb').ObjectId;
const Testimonial = require('../models/testimonial.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Testimonial.find());
  } catch(err) {
    res.status(500).json({message: err});
  }
};

exports.getRandom = async (req, res, next) => {
  try {
    const count = await Testimonial.countDocuments();
    const randNum = Math.floor(Math.random() * count);
    const randItem = await Testimonial.findOne().skip(randNum);
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
      itemFound = await Testimonial.findById(req.params.id);
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
  const { author, text } = req.body;
  try {
    const newTestimonial = new Testimonial({ author, text });
    await newTestimonial.save();
    res.json({ message: 'OK' });
  } catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.putChanges = async (req, res, next) => {
  const { author, text } = req.body;
  let itemFound;
  try {
    if(ObjectId.isValid(req.params.id)) {
      itemFound = await Testimonial.findById(req.params.id);
    }
    if(itemFound) {
      itemFound.author = author;
      itemFound.text = text;
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
      itemFound = await Testimonial.findById(req.params.id);
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
