const router = require('express').Router();
const { concerts } = require('../db.js');

router.route('/concerts').get((req, res) => {
  res.json(concerts);
});

router.route('/concerts/random').get((req, res) => {
  res.json(concerts[Math.floor(Math.random() * concerts.length)]);
});

router.route('/concerts/:id').get((req, res, next) => {
  const requestedId = req.params.id * 1;
  const concertFound = concerts.find(item => item.id === requestedId);
  concertFound ? res.json(concertFound) : next();
});

router.route('/concerts').post((req, res) => {
  const { performer, genre, price, day, image } = req.body;
  if(performer && genre && price && day && image) {
    const id = Math.max(...concerts.map(item => item.id), 0) + 1;
    const newConcert = {
      id,
      performer,
      genre,
      price: price * 1,
      day: day * 1,
      image,
    };
    concerts.push(newConcert);
    res.json({ message: 'OK' });
  } else {
    res.status(400).json({message: 'Bad request'});
  }
});

router.route('/concerts/:id').put((req, res, next) => {
  const requestedId = req.params.id * 1;
  const requestedIdIndex = concerts.findIndex(item => item.id === requestedId);
  const { performer, genre, price, day, image } = req.body;
  if(requestedIdIndex !== -1 && performer && genre && price && day && image) {
    concerts.splice(requestedIdIndex, 1, {
      id: requestedId,
      performer,
      genre,
      price: price * 1,
      day: day * 1,
      image,
    });
    res.json({ message: 'OK' });
  } else if(requestedIdIndex !== -1) {
    res.status(400).json({message: 'Bad request'});
  } else {
    next();
  }
});

router.route('/concerts/:id').delete((req, res, next) => {
  const requestedId = req.params.id * 1;
  const requestedIdIndex = concerts.findIndex(item => item.id === requestedId);
  if(requestedIdIndex !== -1) {
    concerts.splice(requestedIdIndex, 1);
    res.json({ message: 'OK' });
  } else {
    next();
  }
});

module.exports = router;
