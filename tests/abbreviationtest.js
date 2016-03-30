const fs = require("fs");
const orangutan = require("../bibtexParser.js");
const abbreviationChecker = require("../modules/abbreviationChecker.js");
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
      var oran = lipwig.find(parsedBibtex, "jelly_baby").orangutan;

      var abbreviations = lipwig.find(parsedBibtex, "bar")
            .orangutan.journal.abbreviations;

      expect(abbreviations.abbreviation)
        .toEqual(jasmine.arrayContaining(["calphad"]));
      expect(abbreviations.suggestions["calphad"])
        .toEqual(jasmine.arrayContaining(["Calphad - Computer Coupling of Phase Diagrams and Thermochemistry"]));

      done();
    });
  });

  it("should not insert the tag if there's nothing there", function(done) {
    orangutan.parse(bibtexData, function(parsedBibtex) {
      var abbreviations = lipwig.find(parsedBibtex, "abbreviation_no_abbreviation")
            .orangutan;

      expect(abbreviations.author)
        .not.toBeDefined();
      expect(abbreviations.title)
        .not.toBeDefined();
      expect(abbreviations.publisher)
        .not.toBeDefined();
      expect(abbreviations.year)
        .not.toBeDefined();

      done();
    });
  });

  describe("should not crash on", function() {
    it("JavaScript built constructor", function(done) {
      var entry = {
        entryTags: {
          journal: 'constructor'
        }
      };

      abbreviationChecker.checkAbbreviations(entry, {}, false, function() {
        expect(true).toBe(true);
        done();
      });
    });

    it("JavaScript built __proto__", function(done) {
      var entry = {
        entryTags: {
          journal: '__proto__'
        }
      };

      abbreviationChecker.checkAbbreviations(entry, {}, false, function() {
        expect(true).toBe(true);
        done();
      });
    });
  });
});
