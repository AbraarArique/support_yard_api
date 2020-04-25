const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { err, secureParams, updateDoc } = require('./helpers');

const dashboard = async (req, res) => {
  const user = req.user;
  if (user) {
    user.password = '';
    res.status(200).json(user);
  } else {
    res.status(401);
  }
}

const update = async (req, res) => {
  try {
    const user = req.user;
    if (await user.validPassword(req.body.password)) {
      updateDoc(user, secureParams(req.body, whitelist));
      const newPass = req.body.newPassword;
      user.password = newPass ? newPass : req.body.password;
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(401).json(err(null, 'Password is incorrect.'));
    }
  } catch (e) {
    res.status(422).json(err(e));
  }
}

const login = async (req, res) => {
  const token = createToken(req.user);
  res.status(200).json(token);
}

const resetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    const resetPasswordToken = randomString(99);
    const resetPasswordExpires = Date.now() + (1000 * 3600 * 24);
    user.resetPasswordToken = resetPasswordToken;
    await user.update({ resetPasswordToken, resetPasswordExpires });
  } catch (e) {
    console.log(e);
  }
  res.status(200).json({});
}

const newPassword = async (req, res) => {
  try {
    const token = req.body.token;
    const user = await User.findOne({ resetPasswordToken: token });
    if (Date.now() < user.resetPasswordExpires) {
      user.password = req.body.password;
      user.resetPasswordToken = null;
      await user.save();
      res.status(200).json(user.email);
    } else {
      res.status(422).json(err(null, 'This operation is not valid anymore.'));
    }
  } catch (e) {
    res.status(422).json(err(e));
  }
}

const createToken = (user) => {
  const data = {
    user: {
      id: user.id,
      email: user.email
    }
  };
  const token = jwt.sign(data, process.env.JWT_SEC);
  return token;
}

const whitelist = [
  'firstName',
  'lastName',
  'username',
  'phoneNumber',
  'address',
  'bio',
  'email'
];

router.get('/', passport.authenticate('jwt', { session: false }), dashboard);
router.patch('/account', passport.authenticate('jwt', { session: false }), update);
router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  login
);
router.post('/reset-password', resetPassword);
router.post('/new-password', newPassword);

module.exports = router;
