const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
mongoose.connect(process.env.SY_MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB connection established');

  const User = require('./models/user');
  const Ticket = require('./models/ticket');
  const Message = require('./models/message');

  console.log('Starting database cleanup...');
  User.deleteMany({})
  .then(() => {
    console.log('Users deleted');
    return Ticket.deleteMany({});
  })
  .then(() => {
    console.log('Tickets deleted');
    return Message.deleteMany({});
  })
  .then(() => {
    console.log('Messages deleted');
    console.log('Database cleaned successfully.');
    connection.close();
  })
  .catch(e => {
    console.error('An error occurred: ' + e);
  });
});
