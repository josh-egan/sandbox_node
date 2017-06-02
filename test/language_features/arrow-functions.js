'use strict';

const expect = require('chai').expect;

/*
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

 An arrow function expression has a shorter syntax than a function expression and does not bind
 its own this, arguments, super, or new.target. These function expressions are best suited
 for non-method functions, and they cannot be used as constructors.
 */
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

  it('should support bracketed multi-line function', () => {
    const test = (x, y) => {
      const z = x + y;
      return z / 2;
    };

    expect(test(10, 20)).to.eql(15);
  });

  it('should capture `this` from the parent function', function() {
    const control = function() {
      this.foo = 'kelp';
      this.method = function() { return this.foo; }
    };
    const test = function() {
      this.foo = 'bar';
      this.method = () => this.foo;
    };

    expect(new control().method()).to.eql('kelp');
    expect(new test().method()).to.eql('bar');
  });

  it('should capture `arguments` from the parent function', () => {
    const control = function() {
      return Array.prototype.slice.call(arguments);
    };
    const test = function() {
      const arrowFn = () => Array.prototype.slice.call(arguments);
      return arrowFn(1, 2, 3, 4, 5);
    };

    expect(control(6, 7, 8)).to.eql([6, 7, 8]);
    expect(test(9, 10, 11)).to.eql([9, 10, 11]);
  });
});