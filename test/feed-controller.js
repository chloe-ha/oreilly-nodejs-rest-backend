const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const FeedController = require('../controllers/feed');
const Post = require('../models/post');
const User = require('../models/user');
const socket = require('../socket');

describe('FeedController - createPost', () => {
  before((done) => {
    mongoose
      .connect('mongodb+srv://user:user@cluster0.psshf.mongodb.net/test-feed')
      .then(() => {
        const user = new User({
          email: 'testCreatePost@test.com',
          name: 'Tester',
          password: 'tester',
          posts: [],
          _id: '618af4e3a63eddb3cde851fe',
        });
        return user.save();
      })
      .then(() => done());
  });

  it('should add a created post to the posts of the creator', (done) => {
    sinon.stub(socket, 'getIO');
    socket.getIO.returns({ emit: () => {} });

    const req = {
      userId: '618af4e3a63eddb3cde851fe',
      body: { title: 'Title', content: 'Content' },
      file: { path: 'a/path' },
    };
    const res = {
      status: function () {
        return this;
      },
      json: () => {},
    };
    FeedController.createPost(req, res, () => {}).then((result) => {
      expect(result).to.have.property('posts');
      expect(result.posts).to.have.length(1);

      socket.getIO.restore();
      done();
    });
  });

  after((done) => {
    User.deleteMany({ email: 'testCreatePost@test.com' })
      .then(() => Post.deleteMany({ title: 'Title' }))
      .then(() => mongoose.disconnect())
      .then(() => done());
  });
});
