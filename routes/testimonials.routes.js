const router = require('express').Router();
const { testimonials } = require('../db.js');

router.route('/testimonials').get((req, res) => {
  res.json(testimonials);
});

router.route('/testimonials/random').get((req, res) => {
  res.json(testimonials[Math.floor(Math.random() * testimonials.length)]);
});

router.route('/testimonials/:id').get((req, res, next) => {
  const requestedId = req.params.id * 1;
  const testimonialFound = testimonials.find(item => item.id === requestedId);
  testimonialFound ? res.json(testimonialFound) : next();
});

router.route('/testimonials').post((req, res, next) => {
  const { author, text } = req.body;
  if(author && text) {
    const id = Math.max(...testimonials.map(item => item.id), 0) + 1;
    const newTestimonial = {
      id,
      author,
      text,
    };
    testimonials.push(newTestimonial);
    res.json({ message: 'OK' });
  } else {
    res.status(400).json({message: 'Bad request'});
  }
});

router.route('/testimonials/:id').put((req, res, next) => {
  const requestedId = req.params.id * 1;
  const requestedIdIndex = testimonials.findIndex(item => item.id === requestedId);  
  const { author, text } = req.body;
  if(requestedIdIndex !== -1 && author && text) {    
    testimonials.splice(requestedIdIndex, 1, {
      id: requestedId,
      author,
      text,
    });        
    res.json({ message: 'OK' });
  } else if(requestedIdIndex !== -1) {
    res.status(400).json({message: 'Bad request'});
  } else {
    next();
  }
});

router.route('/testimonials/:id').delete((req, res, next) => {
  const requestedId = req.params.id * 1;
  const requestedIdIndex = testimonials.findIndex(item => item.id === requestedId);  
  if(requestedIdIndex !== -1) {
    testimonials.splice(requestedIdIndex, 1);
    res.json({ message: 'OK' });
  } else {
    next();
  }
});

module.exports = router;