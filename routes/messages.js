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
    const message = await Message.deleteOne({ userId: req.user._id, _id: req.params.messageId });
    if (message.n < 1) throw new Error('Operation not permitted.');
    res.status(200).json({});
  } catch (e) {
    res.status(422).json(err(e));
  }
}

const getMessage = async (user, id) => {
  return await Message.findOne({ userId: user._id, _id: id });
}

const whitelist = [
  'message'
];

router.post('/', create);
router.patch('/:messageId', update);
router.delete('/:messageId', destroy);

module.exports = router;
