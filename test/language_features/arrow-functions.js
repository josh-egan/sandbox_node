'use strict';

const expect = require('chai').expect;

describe('arrow functions', () => {
  it('should not require brackets for a one liner and should return the result on the right of the arrow', () => {
    const test = () => 'such awesome';

    expect(test()).to.eql('such awesome');
  });

  it('should support inputs for a one liner', () => {
    const test = (x) => x + 7;

    expect(test(9)).to.eql(16);
  });

  it('should support multiple inputs', () => {
    const test = (x, y, z) => x + y + z;

    expect(test(9, 2, 5)).to.eql(16);
  });

  it('should capture the parent function context', function() {
    this.foo = 'bar';

    const control = function() { return this && this.foo; };
    const test = () => this.foo;

    expect(control()).to.eql(undefined);
    expect(test()).to.eql('bar');
  });

  it('should support bracketed multi-line function', () => {
    const test = (x, y) => {
      const z = x + y;
      return z / 2;
    };

    expect(test(10, 20)).to.eql(15);
  });
});