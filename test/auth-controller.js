const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('AuthController - signup', () => {
  before((done) => {
    mongoose.connect('mongodb+srv://user:user@cluster0.psshf.mongodb.net/test-feed').then(() => {
      done();
    });
  });

  it('should send a response with a valid userId', (done) => {
    const req = { body: { email: 'testsignup@test.com', name: 'Tester', password: 'tester' } };
    const res = {
      statusCode: 500,
      userId: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userId = data.userId;
      },
    };
    AuthController.signup(req, res, () => {}).then(() => {
      expect(res.statusCode).to.be.equal(201);
      expect(res.userId).to.be.a('string');
      done();
    });
  });

  after((done) => {
    User.deleteMany({ email: 'testsignup@test.com' })
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => done());
  });
});

describe('AuthController - login', () => {
  it('should throw an error if accessing the database fails', (done) => {
    sinon.stub(User, 'findOne');
    User.findOne.throws();
    const req = { body: { email: 'tester@test.com', password: 'tester' } };

    AuthController.login(req, {}, () => {}).then((result) => {
      expect(result).to.be.an('error');
      expect(result).to.have.property('statusCode', 500);
      done();
    });

    User.findOne.restore();
  });
});
