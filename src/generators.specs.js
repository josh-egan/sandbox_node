'use strict';

const expect = require('chai').expect;

describe('generators', () => {
  it('should run tests', () => {
    expect(true).to.equal(true);
  });

  it('should fail a test', () => {
    expect(false).to.equal(true);
  });
});