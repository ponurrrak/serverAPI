const express = require('express');
const path = require('path');
const cors = require('cors');
const socket = require('socket.io');
const mongoose = require('mongoose');
const testimonialsRoutes = require('./routes/testimonials.routes.js');
const concertsRoutes = require('./routes/concerts.routes.js');
const seatsRoutes = require('./routes/seats.routes.js');
const config = require('./config');

const app = express();

mongoose.connect(config.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
  if(process.env.NODE_ENV !== 'test') {
    console.log('Connected to the database');
  }
});
db.on('error', err => console.log('Error ' + err));

const server = app.listen(config.apiPort, () => {
  if(process.env.NODE_ENV !== 'test') {
    console.log('Server is running on port: ' + config.apiPort);
  }
});

const io = socket(server);

io.on('connection', socket => {
  if(process.env.NODE_ENV !== 'test') {
    console.log('New socket: id ' + socket.id);
  }
});

if(process.env.NODE_ENV !== 'production') {
  const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
  };
  app.options('*', cors(corsOptions));
  app.use(cors(corsOptions));
}

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', (req, res, next) => {
  if(req.method === 'POST' && req.url === '/seats') {
    req.io = io;
  }
  next();
});

app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/concerts', concertsRoutes);
app.use('/api/seats', seatsRoutes);

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

module.exports = server;
