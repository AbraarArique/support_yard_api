const mongoose = require('mongoose');

const { hasMany, belongsTo } = require('./helpers');

const ticketSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Subject can\'t be blank']
  },
  details: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, { timestamps: true });

belongsTo(ticketSchema, 'User', 'user', 'userId');
hasMany(ticketSchema, 'Message', 'messages', 'ticketId');

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
