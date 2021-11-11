const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/isauth');

describe('Auth middleware', () => {
  it('should throw an error if no authorization header is present', () => {
    const req = { get: () => null };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated');
  });

  it('should throw an error if the authorization header is only one string', () => {
    const req = { get: () => 'xyz' };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it('should throw an error if the token cannot be verified', () => {
    const req = { get: () => 'Bearer xyz' };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it('should yield a userId after decoding the token', () => {
    const req = { get: () => 'Bearer asdasdasdasd' };
    sinon.stub(jwt, 'verify');
    jwt.verify.returns({ userId: 'decoded_token' });
    authMiddleware(req, {}, () => {});

    expect(req).to.have.property('userId', 'decoded_token');
    expect(jwt.verify.called).to.be.true;

    jwt.verify.restore();
  });
});
