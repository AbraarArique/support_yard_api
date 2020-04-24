const express = require('express');
const router = express.Router();

const { formatErr, secureParams, updateDoc } = require('./helpers');

const index = async (req, res) => {
  try {
    const user = req.user;
    const tickets = await user.tickets();
    res.status(200).json(tickets);
  } catch (e) {
    res.status(400).json(formatErr(e));
  }
}

const show = async (req, res) => {
  try {
    const user = req.user;
    const [ticket] = await user.tickets({ id: req.params.ticketId });
    res.status(200).json(ticket);
  } catch (e) {
    res.status(400).json(formatErr(e));
  }
}

const create = async (req, res) => {
  try {
    const user = req.user;
    const ticket = await user.tickets({ id: req.params.ticketId });
    res.status(200).json(ticket);
  } catch (e) {
    res.status(400).json(formatErr(e));
  }
}

const ticketParams = params => {
  return secureParams(params, [
    'subject',
    'details'
  ]);
}

router.get('/', index);
router.get('/:ticketId', show);
router.post('/', create);

module.exports = router;
