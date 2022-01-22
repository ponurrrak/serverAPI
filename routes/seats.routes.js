const router = require('express').Router();
const { seats } = require('../db.js');

router.route('/seats').get((req, res) => {
  res.json(seats);
});

router.route('/seats/random').get((req, res) => {
  res.json(seats[Math.floor(Math.random() * seats.length)]);
});

router.route('/seats/:id').get((req, res, next) => {
  const requestedId = req.params.id * 1;
  const seatFound = seats.find(item => item.id === requestedId);
  seatFound ? res.json(seatFound) : next();
});

router.route('/seats').post((req, res, next) => {
  const { client, email } = req.body;
  const seat = req.body.seat * 1;
  const day = req.body.day * 1;
  const isBooked = seats.find(item => (
    item.seat === seat && item.day === day
  ));
  if(day && seat && client && email && !isBooked) {
    const id = Math.max(...seats.map(item => item.id), 0) + 1;
    const newSeat = {
      id,
      day,
      seat,
      client,
      email
    };
    seats.push(newSeat);
    res.json({ message: 'OK' });
  } else if(!isBooked) {
    res.status(400).json({message: 'Bad request'});
  } else {
    res.status(409).json({message: 'The seat is already taken...'});
  }
});

router.route('/seats/:id').put((req, res, next) => {
  const requestedId = req.params.id * 1;
  const requestedIdIndex = seats.findIndex(item => item.id === requestedId);
  const { client, email } = req.body;
  const seat = req.body.seat * 1;
  const day = req.body.day * 1;
  const isBooked = seats.find(item => (
    item.seat === seat && item.day === day
  ));
  if(requestedIdIndex !== -1 && day && seat && client && email && !isBooked) {
    seats.splice(requestedIdIndex, 1, {
      id: requestedId,
      day,
      seat,
      client,
      email,
    });
    res.json({ message: 'OK' });
  } else if(requestedIdIndex !== -1 && !isBooked) {
    res.status(400).json({message: 'Bad request'});
  } else if(isBooked) {
    res.status(409).json({message: 'The slot is already taken...'});
  } else {
    next();
  }
});

router.route('/seats/:id').delete((req, res, next) => {
  const requestedId = req.params.id * 1;
  const requestedIdIndex = seats.findIndex(item => item.id === requestedId);
  if(requestedIdIndex !== -1) {
    seats.splice(requestedIdIndex, 1);
    res.json({ message: 'OK' });
  } else {
    next();
  }
});

module.exports = router;
