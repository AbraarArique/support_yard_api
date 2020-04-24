const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { hasMany } = require('./helpers');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  username: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  address: {
    type: String
  },
  bio: {
    type: String
  },
  policyAcceptedAt: {
    type: Date,
    required: [true, 'You must accept the terms and privacy policy.']
  },
  email: {
    type: String,
    required: [true, 'Email can\'t be empty.'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password can\'t be empty.'],
    minlength: [8, 'Password must be at least 8 characters long.']
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  isCustomer: {
    type: Boolean,
    required: true
  },
  isAgent: {
    type: Boolean,
    required: true
  }
}, { timestamps: true });

hasMany(userSchema, 'Ticket', 'tickets', 'userId');

userSchema.pre('save', async function(next) {
  if (this.password.length < 8) {
    next(new Error('Password must be at least 8 characters long.'));
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.validPassword = async function(password) {
  try {
    result = await bcrypt.compare(password, this.password);
    return result;
  } catch (e) {
    return false;
  }
}

const User = mongoose.model('User', userSchema);

module.exports = User;
