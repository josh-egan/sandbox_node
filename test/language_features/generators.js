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

    expect(iterable.next()).to.eql({ value: 1, done: false });
    expect(iterable.next()).to.eql({ value: 2, done: false });
    expect(iterable.next()).to.eql({ value: 3, done: false });
    expect(iterable.next()).to.eql({ value: undefined, done: true });
    expect(iterable.next()).to.eql({ value: undefined, done: true });
  });

  it('should throw if the throw method is used', () => {
    function* test() {
      yield 1;
      yield 2;
    }

    const iterable = test();

    const err = new Error('oops');
    expect(iterable.next().value).to.equal(1);
    try {
      iterable.throw(err);
    } catch (e) {
      expect(e).to.eql(err);
    }
  });

  if (process.version >= 'v6') {
    it('should short circuit the generator if the return method is used', () => {
      function* test() {
        yield 1;
        yield 2;
        yield 3;
      }

      const iterable = test();

      expect(iterable.next().value).to.equal(1);
      expect(iterable.return(8).value).to.equal(8);
      expect(iterable.next().value).to.equal(undefined);
    });
  }

  it('should end the generator on a return statement', () => {
    function* test() {
      yield 1;
      return 2;
      //noinspection UnreachableCodeJS
      yield 3;
    }

    const iterable = test();

    expect(iterable.next().value).to.equal(1);
    expect(iterable.next().value).to.equal(2);
    expect(iterable.next().value).to.equal(undefined);
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
        yield str + c;
      }

      iterable = t();

      expect(iterable.next().value).to.equal('foo');
      expect(iterable.next('bar').value).to.equal('foobar'); //noinspection SpellCheckingInspection
      expect(iterable.next('baz').value).to.equal('foobarbaz'); //noinspection SpellCheckingInspection
      expect(iterable.next('yui').value).to.equal('foobarbazyui'); //noinspection SpellCheckingInspection
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

  context('when using yield*', () => {
    it('should yield all of the results from a generator on a yield*', () => {
      function* test1() {
        yield 'before';
        yield* test2();
        yield 'after';
      }

      function* test2() {
        yield 1;
        yield 2;
        yield* test3();
        yield 3;
      }

      function* test3() {
        yield 2.1;
        yield 2.2;
        yield 2.3;
      }

      const iterable = test1();

      expect(iterable.next().value).to.equal('before');
      expect(iterable.next().value).to.equal(1);
      expect(iterable.next().value).to.equal(2);
      expect(iterable.next().value).to.equal(2.1);
      expect(iterable.next().value).to.equal(2.2);
      expect(iterable.next().value).to.equal(2.3);
      expect(iterable.next().value).to.equal(3);
      expect(iterable.next().value).to.equal('after');
      expect(iterable.next().value).to.equal(undefined);
    });

    it('should iterate over any type of iterable using a yield*', () => {
      function* test() {
        yield* [-2, -1, 0];
        yield* test1();
        let capturedResult = yield* test2();
        yield capturedResult;
        yield* 'foo';
      }

      function* test1() {
        yield 1;
        yield 2;
        return 20;
      }

      function* test2() {
        yield 3;
        yield 4;
        return 30;
      }

      const iterable = test();

      expect(iterable.next().value).to.equal(-2);
      expect(iterable.next().value).to.equal(-1);
      expect(iterable.next().value).to.equal(0);
      expect(iterable.next().value).to.equal(1);
      expect(iterable.next().value).to.equal(2);
      expect(iterable.next().value).to.equal(3);
      expect(iterable.next().value).to.equal(4);
      expect(iterable.next().value).to.equal(30);
      expect(iterable.next().value).to.equal('f');
      expect(iterable.next().value).to.equal('o');
      expect(iterable.next().value).to.equal('o');
    });
  });
});