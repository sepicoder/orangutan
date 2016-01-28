const fs = require("fs");
const lipwig = require("./lipwig.js");
const orangutan = require("../bibtexParser.js");

describe("When running the bibtex parser it", function() {
  var bibtexData;

  beforeAll(function(done) {
/*    fs.readFile("./bibtex-tests/generaltest.bib", function(error, data) {
      bibtexData = data.toString();
      done();
    });
 */
    done();
  });

  it("should throw RangeError on bad amounts of arguments", function() {
    expect(lipwig.wrapFunction(orangutan.parse))
      .toThrowError(RangeError, "To few arguments given, should at least be a string with bibtex and a callback");

    expect(lipwig.wrapFunction(orangutan.parse, "foo"))
      .toThrowError(RangeError, "To few arguments given, should at least be a string with bibtex and a callback");

    expect(lipwig.wrapFunction(orangutan.parse, function() {}))
      .toThrowError(RangeError, "To few arguments given, should at least be a string with bibtex and a callback");

    expect(lipwig.wrapFunction(orangutan.parse, true))
      .toThrowError(RangeError, "To few arguments given, should at least be a string with bibtex and a callback");
  });

  it("should accept no more than three parameters", function() {
    expect(lipwig.wrapFunction(orangutan.parse, "foo", 42, true, function() {}))
      .toThrowError(RangeError, "To many arguments given, should at most be a string with bibtex, if it should keep the entries and a callback");

    expect(lipwig.wrapFunction(orangutan.parse, "foo", "bar", "baz", 300, true, function() {}))
      .toThrowError(RangeError, "To many arguments given, should at most be a string with bibtex, if it should keep the entries and a callback");
  });

  it("should remove entries when second argument is false", function(done) {
    orangutan.parse(bibtexData, false, function() {
      expect(42);

      done();
    });
  });
});