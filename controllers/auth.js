const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/user');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const { email, name, password } = req.body;
  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({ email, name, password: hashedPassword });
      return user.save();
    })
    .then(result => {
      return res.status(201).json({
        message: 'User created',
        userId: result._id
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let fetchedUser;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        const error = new Error('Wrong username or password');
        error.statusCode = 401;
        throw error;
      }
      fetchedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(doMatch => {
      if (!doMatch) {
        const error = new Error('Wrong username or password');
        error.statusCode = 401;
        throw error;
      }
      const userId = fetchedUser._id.toString();
      const token = jwt.sign({
        email: fetchedUser.email,
        userId
      }, 'JWT_SECRET_KEY', { expiresIn: '1h' });
      return res.status(200).json({ token, userId });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};