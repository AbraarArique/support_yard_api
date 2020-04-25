const express = require('express');
const router = express.Router({ mergeParams: true });

const Ticket = require('../models/ticket');
const Message = require('../models/message');
const { err, secureParams, updateDoc, getTicket } = require('./helpers');

const create = async (req, res) => {
  try {
    const ticket = await getTicket(req.user, req.params.ticketId);
    const message = new Message(secureParams(req.body, whitelist));
    message.ticketId = ticket._id;
    message.userId = req.user._id;
    await message.save();
    res.status(200).json(message);
  } catch (e) {
    res.status(422).json(err(e));
  }
}

const update = async (req, res) => {
  try {
    const ticket = await getTicket(req.user, req.params.ticketId);
    const message = await getMessage(req.user, req.params.messageId);
    updateDoc(message, req.body, whitelist);
    await message.save();
    res.status(200).json(message);
  } catch (e) {
    res.status(422).json(err(e));
  }
}

const destroy = async (req, res) => {
  try {
    const ticket = await getTicket(req.user, req.params.ticketId);
    const message = await getMessage(req.user, req.params.messageId);
    await Message.deleteOne({ _id: message._id });
    res.status(200).json(message);
  } catch (e) {
    res.status(422).json(err(e));
  }
}

const getMessage = async (user, id) => {
  const [message] = await user.messages({ _id: id });
  return message;
}

const whitelist = [
  'message'
];

router.post('/', create);
router.patch('/:messageId', update);
router.delete('/:messageId', destroy);

module.exports = router;
