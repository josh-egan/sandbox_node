'use strict';

const expect = require('chai').expect;

/*
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators

 A GeneratorFunction is a special type of function that works as a factory for iterators.
 When it is executed it returns a new Generator object. A function becomes a GeneratorFunction
 if it uses the function* syntax.
 */

describe('generators', () => {
  it('should create an iterable', () => {
    const test = function*() {
      let i = 0;
      while (true)
        yield i++;
    };

    const iterable = test();

    expect(iterable.next().value).to.equal(0);
    expect(iterable.next().value).to.equal(1);
    expect(iterable.next().value).to.equal(2);
    expect(iterable.next().value).to.equal(3);
    expect(iterable.next().value).to.equal(4);
    expect(iterable.next().value).to.equal(5);

    expect(iterable.next()).to.eql({ value: 6, done: false });
  });

  it('should return each yield in the order of definition and return undefined when finished', () => {
    const test = function*() {
      yield 1;
      yield 2;
      yield 3;
    };

    const iterable = test();

    expect(iterable.next().value).to.equal(1);
    expect(iterable.next().value).to.equal(2);
    expect(iterable.next()).to.eql({ value: 3, done: false });
    expect(iterable.next()).to.eql({ value: undefined, done: true });
    expect(iterable.next()).to.eql({ value: undefined, done: true });
  });

  context('when passing values into a generator', () => {
    function* test() {
      let i = 0;
      let numToAdd = 1;
      while (true) {
        let newNumToAdd = yield i += numToAdd;
        if (typeof newNumToAdd === 'number')
          numToAdd = newNumToAdd;
      }
    }

    let iterable;

    beforeEach(() => {
      iterable = test();
    });

    it('should pause on the right hand side of the yield before continuing such that the value passed into the subsequent next() call is the return value for the yield in the generator', () => {
      function* t() {
        let str = 'foo';
        let a = yield str;
        let b = yield str += a;
        let c = yield str += b;
        yield str += c;
      }

      iterable = t();

      expect(iterable.next().value).to.equal('foo');
      expect(iterable.next('bar').value).to.equal('foobar');
      expect(iterable.next('baz').value).to.equal('foobarbaz');
      expect(iterable.next('yui').value).to.equal('foobarbazyui');
    });

    it('should do nothing if a value is passed in the very first time next is called', () => {
      expect(iterable.next(3).value).to.equal(1);
      expect(iterable.next().value).to.equal(2);
      expect(iterable.next().value).to.equal(3);
      expect(iterable.next().value).to.equal(4);
      expect(iterable.next().value).to.equal(5);
    });

    it('should apply the passed in value the next time through', () => {
      expect(iterable.next().value).to.equal(1);
      expect(iterable.next(4).value).to.equal(5);
      expect(iterable.next().value).to.equal(9);
      expect(iterable.next(2).value).to.equal(11);
    });
  });

});