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

  const seed = [
    {
      email: 'c1@abc.com',
      password: 'c1password',
      policyAcceptedAt: Date.now(),
      isCustomer: true,
      isAgent: false
    },
    {
      email: 'c2@abc.com',
      password: 'c2password',
      policyAcceptedAt: Date.now(),
      isCustomer: true,
      isAgent: false
    },
    {
      email: 'a1@abc.com',
      password: 'a1password',
      policyAcceptedAt: Date.now(),
      isCustomer: false,
      isAgent: true
    },
    {
      email: 'a2@abc.com',
      password: 'a2password',
      policyAcceptedAt: Date.now(),
      isCustomer: false,
      isAgent: true
    }
  ];

  console.log('Starting database seeding...');
  (new User(seed[0])).save()
  .then(() => {
    console.log('User #1 created');
    return (new User(seed[1])).save();
  })
  .then(() => {
    console.log('User #2 created');
    return (new User(seed[2])).save();
  })
  .then(() => {
    console.log('User #3 created');
    return (new User(seed[3])).save();
  })
  .then(() => {
    console.log('User #4 created');
    console.log('Data seeded successfully.');
    connection.close();
  })
  .catch(e => {
    console.error('An error occurred: ' + e);
  });
});
