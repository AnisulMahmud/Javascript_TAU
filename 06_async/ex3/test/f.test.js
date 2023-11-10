const expect = require("chai").expect;

const f = require("../f_skeleton");

describe("thenable", () => {
  
    // TODO: Implement this test. See rejectable below for an example -- done
    // See: https://www.testim.io/blog/testing-promises-using-mocha/
    // This test can be implemented with either Promises or with async / await, as shown on that page.
    // Use expect() and to.equal()
    // to make sure that the resolved value is 👍
    it("resolves with correct value", () => {
      return Promise.resolve(f.thenable)
      .then((value) => {
      expect(value).to.equal("👍");
      });
    });
  });

describe("rejectable", () => {
  it("rejects with correct value", (done) => {
    Promise.reject(f.rejectable)
      .catch((err) => err)
      .catch((err) => {
        expect(err).to.equal("👎");
        done();
      });
  });
});