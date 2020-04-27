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
});

const User = require('./models/user');

(async () => {
  try {
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
    seed.forEach(async (u, i) => {
      const user = new User(u);
      await user.save();
      console.log(`User #${ i + 1 } added.`);
    });
  } catch (e) {
    console.log('An error occurred:');
    console.log(e);
  }
})();
