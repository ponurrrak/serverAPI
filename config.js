module.exports = {
  mongoUrl: process.env.NEW_WAVE_DB_URL || 'mongodb://localhost:27017/NewWaveDB',
  apiPort: process.env.PORT || 8000,
};
