module.exports = {
  mongoUrl: process.env.NEW_WAVE_DB_URL || ('mongodb://localhost:27017/NewWaveDB' + (process.env.NODE_ENV === 'test' ? 'test' : '')),
  apiPort: process.env.PORT || 8000,
};
