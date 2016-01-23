const fs = require("fs");
const orangutan = require("../bibtexParser.js");
const lipwig = require("./lipwig.js");

describe("When searching for abbreviations it", function() {
  var bibtexData;

  beforeAll(function(done) {
    fs.readFile("./bibtex-tests/abbreviations.bib", function(error, data) {
      bibtexData = data.toString();
      done();
    });
  });

  it("should detect standard abbreviations", function(done) {
    orangutan.parse(bibtexData, function(parsedBibtex) {
      var abbreviations = lipwig.find(parsedBibtex, "jelly_baby")
            .orangutan.journal.abbreviations;

      expect(abbreviations.abbreviation)
        .toEqual(jasmine.arrayContaining(["am. j. potato res."]));
      expect(abbreviations.suggestions["am. j. potato res."])
        .toEqual(jasmine.arrayContaining(["American Journal of Potato Research"]));

      done();
    });
  });

  it("should detect abbreviations defined in strings", function(done) {
    orangutan.parse(bibtexData, function(parsedBibtex) {
      var abbreviations = lipwig.find(parsedBibtex, "bar")
            .orangutan.journal.abbreviations;

      expect(abbreviations.abbreviation)
        .toEqual(jasmine.arrayContaining(["calphad"]));
      expect(abbreviations.suggestions["calphad"])
        .toEqual(jasmine.arrayContaining(["Calphad - Computer Coupling of Phase Diagrams and Thermochemistry"]));

      done();
    });
  });
});
