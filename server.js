const express = require('express');
const path = require('path');
const cors = require('cors');
const testimonialsRoutes = require('./routes/testimonials.routes.js');
const concertsRoutes = require('./routes/concerts.routes.js');
const seatsRoutes = require('./routes/seats.routes.js');

const app = express();

if(process.env.NODE_ENV !== 'production') {
  const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
  };
  app.options('*', cors());
  app.use(cors(corsOptions));
}

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', testimonialsRoutes);
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);

app.use('/api', (req, res, next) => {
  if(req.method === 'GET') {
    res.status(404).json({message: 'Not Found'});
  } else {
    next();
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.use((req, res) => {
  switch (req.method) {
    case 'DELETE':
    case 'POST':
    case 'PUT':
      res.status(404).json({message: 'Not Found'});
      break;
    default:
      res.status(405).json({message: 'Method Not Allowed'});
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log('Server is running on port: ' + port);
});
