const express = require('express');
const createError = require('http-errors');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');

require('dotenv').config();

require('./passport.config.js');

const PORT = process.env.SY_PORT || 5000;
const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

// MongoDB connection
mongoose.connect(process.env.SY_MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB connection established');
});

// Routers
const users = require('./routes/users');
const tickets = require('./routes/tickets');
app.use('/api/', users);
app.use('/api/tickets', passport.authenticate('jwt', { session: false }), tickets);
app.use('/', (req, res) => {
  res.status(200).json({ message: 'Back-end API up and running.'});
});

// Catch 404 errors
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  res.status(err.status || 500);
  res.json(res.locals.error);
});

// Start server
app.listen(PORT, () => {
  console.log('Server is operational on port ' + PORT);
});

module.exports = app;
