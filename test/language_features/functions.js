// Note that use strict is intentionally not placed at the top of this file.

function globalFunctionStrict() {
  'use strict';
  return this;
}

function globalFunction() {
  return this;
}

describe('functions', () => {

  /*
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this

   In the global execution context (outside of any function), this refers to the global object, whether in strict mode or not.
   */
  context('this keyword', () => {
    it('a function NOT in strict mode should return the global object as this', () => {
      function localFunction() {
        return this;
      }

      expect(globalFunction()).to.eql(global);
      expect(localFunction()).to.eql(global);
    });

    it('a function in strict mode will have a this of undefined unless newed up in which case it will get its own this object', () => {
      function localFunctionStrict() {
        'use strict';
        return this;
      }

      expect(globalFunctionStrict()).to.be.undefined;
      expect(localFunctionStrict()).to.be.undefined;
      expect(new globalFunctionStrict()).to.be.eql({});
      expect(new localFunctionStrict()).to.be.eql({});
    });
  });
});