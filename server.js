const express = require('express');
const cors = require('cors');
const testimonialsRoutes = require('./routes/testimonials.routes.js');
const concertsRoutes = require('./routes/concerts.routes.js');
const seatsRoutes = require('./routes/seats.routes.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', testimonialsRoutes);
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);

app.use((req, res) => {
  switch (req.method) {
    case 'GET':
    case 'DELETE':
    case 'POST':
    case 'PUT':
      res.status(404).json({message: 'Not Found'});
      break;    
    default:
      res.status(405).json({message: 'Method Not Allowed'});
  }
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
