'use strict';

describe('promises', () => {
  describe('node native promises', () => {
    describe('#Promise.resolve', () => {
      it('should resolve the promise with the value provided', () => {
        return Promise.resolve('foo')
          .then(result => expect(result).to.equal('foo'));
      });

      it('should resolve if given an error', () => {
        return Promise.resolve(new Error('ooops'))
          .then(result => expect(result.message).to.equal('ooops'));
      });

      it('should resolve a function and return the result', () => {
        return Promise.resolve(() => 1234)
          .then(result => expect(result).to.be.a('function'));
      });
    });

    describe('#Promise.reject', () => {
      it('should reject when given a primitive type', () => {
        return Promise.reject(1234)
          .catch(err => expect(err).to.equal(1234));
      });

      it('should reject a function', () => {
        return Promise.reject(() => 1234)
          .catch(err => expect(err).to.be.a('function'));
      });

      it('should reject with an error', () => {
        return Promise.reject(new Error('asdf'))
          .catch(err => expect(err.message).to.equal('asdf'));
      });
    });

    describe('#Promise constructor', () => {
      it('should work with the resolve callback', () => {
        return new Promise((resolve, reject) => resolve('foo'))
          .then(result => expect(result).to.equal('foo'));
      });

      it('should work with the reject callback', () => {
        return new Promise((resolve, reject) => reject(new Error('hjk')))
          .catch(err => expect(err.message).to.equal('hjk'));
      });

      it('should reject if an error is thrown inside of the function', () => {
        let error;
        return new Promise((resolve, reject) => {
          const randValue = Math.random();
          if (randValue < 1)
            throw new Error('What, this library does what it is supposed to do? Got a random value of: ' + randValue);
          resolve();
        })
          .catch(err => error = err)
          .then(() => expect(error.message).to.match(/What, this library does what it is supposed to do/));
      });
    });

    describe('#.then', () => {
      it('should take in the result of the resolved promise', () => {
        return new Promise((resolve, reject) => resolve('asdf'))
          .then(result => expect(result).to.equal('asdf'));
      });

      it('should also be able to handle the error with a second callback', () => {
        return new Promise((resolve, reject) => reject(new Error('yui')))
          .then(result => {
          }, err => expect(err.message).to.equal('yui'));
      });

      it('should execute successive then callbacks', () => {
        return new Promise((resolve, reject) => resolve('foo'))
          .then(result => expect(result).to.equal('foo'))
          .then(result => expect(result).to.be.an('object'));
      });
    });

    describe('when an unknown number of iterations needs to be made', () => {

      it('should resolve success', () => {
        const maxAttempts = 5;

        return attemptUntilSuccess().then(result => expect(result).to.equal('success'));

        function attemptUntilSuccess() {
          let numberOfAttempts = 0;

          return new Promise((resolve, reject) => {
            makeAttempt();

            function makeAttempt() {
              return probablyWillFail()
                .then(resolve)
                .catch(() => {
                  return numberOfAttempts++ >= maxAttempts
                    ? reject(new Error('Reached the maximum number of attempts'))
                    : makeAttempt();
                });
            }
          });

          function probablyWillFail() {
            return new Promise((resolve, reject) => {
              if (numberOfAttempts === maxAttempts - 1) resolve('success');
              else reject(new Error('Not your lucky day!'));
            });
          }
        }
      });

      it('should throw once the max attempts have been exceeded', () => {
        const maxAttempts = 5;
        let error;

        return attemptUntilSuccess().catch(err => error = err).then(() => expect(error.message).to.equal('Reached the maximum number of attempts'));

        function attemptUntilSuccess() {
          let numberOfAttempts = 0;

          return new Promise((resolve, reject) => {
            makeAttempt();

            function makeAttempt() {
              return probablyWillFail()
                .then(resolve)
                .catch(() => {
                  return numberOfAttempts++ >= maxAttempts
                    ? reject(new Error('Reached the maximum number of attempts'))
                    : makeAttempt();
                });
            }
          });

          function probablyWillFail() {
            return new Promise((resolve, reject) => {
              if (numberOfAttempts === maxAttempts + 6789) resolve('success');
              else reject(new Error('Not your lucky day!'));
            });
          }
        }
      });

      it('should throw if a secondary promise fails', () => {
        const maxAttempts = 5;
        let error;

        return attemptUntilSuccess().catch(err => error = err).then(() => expect(error.message).to.equal('Can\'t win for losing.'));

        function attemptUntilSuccess() {
          let numberOfAttempts = 0;

          return new Promise((resolve, reject) => {
            makeAttempt();

            function makeAttempt() {
              // console.log('making attempt #', numberOfAttempts);
              return probablyWillFail()
                .then(resolve)
                .catch(() => {
                  return numberOfAttempts++ >= maxAttempts
                    ? reject(new Error('Reached the maximum number of attempts'))
                    : goingToFail()
                      .then(makeAttempt)
                      .catch(reject);
                });
            }
          });

          function probablyWillFail() {
            return new Promise((resolve, reject) => {
              if (numberOfAttempts === maxAttempts - 1) resolve('success');
              else reject(new Error('Not your lucky day!'));
            });
          }

          function goingToFail() {
            return new Promise((resolve, reject) => {
              if (numberOfAttempts > numberOfAttempts + 10) resolve('success');
              else reject(new Error('Can\'t win for losing.'));
            });
          }
        }
      });
    });
  });
});