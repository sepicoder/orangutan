var weatherwax = require("../weatherwax.js");

describe("When taking Granny Weatherwax for a swing", function() {
  it("and setting ordered they should be called in order even when called backwards", function(done) {
    var testData = [];
    var callbacks = [];
    var granny = weatherwax(function() {
      for (var k=0; k<10; k++) {
        expect(testData[k]).toBe(k);
      }

      done();
    });
    granny.setOrdered(true);

    for (var i=0; i<10; i++) {
      callbacks.push(
        granny(
          (function(index) {
            return function() {
              testData.push(index);
            };
          })(i)
        )
      );
    }

    granny.run();

    for (var j=9; j>-1; j--) {
      callbacks[j]();
    }
  });
});
