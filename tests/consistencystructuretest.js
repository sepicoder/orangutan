const fs = require("fs");
const orangutan = require("../consistency.js");

describe("When creating the data structure for consistency it", function() {
  var bibtexData;

  beforeAll(function(done) {
    fs.readFile("./bibtex-tests/consistencyStructure.bib", function(error, data) {
      bibtexData = data.toString();

      done();
    });
  });

  describe("should keep proper statistics for", function() {
    it("total amount of entries", function() {

    });

    it("total amount of articles and fields", function() {

    });
  });
});
