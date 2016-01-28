const fs = require("fs");
const lipwig = require("./lipwig.js");
const orangutan = require("../bibtexParser.js");
const weatherwax = require("../weatherwax.js");

describe("When running the bibtex parser it", function() {
  var bibtexData, bibtexCleanData, bibtexOverrides;

  beforeAll(function(done) {
    var granny = weatherwax(done);

    fs.readFile("./bibtex-tests/general-test.bib", granny(function(error, data) {
      bibtexData = data.toString();
    }));

    fs.readFile("./bibtex-tests/general-clean-test.bib", granny(function(error, data) {
      bibtexCleanData = data.toString();
    }));

    fs.readFile("./bibtex-tests/general-overrides.bib", granny(function(error, data) {
      bibtexOverrides = data.toString();
    }));

    granny.run();
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

  describe("when setting keep entries to false it", function() {
    it("should remove correct entries", function(done) {
      orangutan.parse(bibtexData, false, function(parsedBibtex) {
        expect(lipwig.find(parsedBibtex, "article_clean")).toBe(false);
        expect(lipwig.find(parsedBibtex, "article_spelling")).toBeDefined();
        expect(lipwig.find(parsedBibtex, "article_inconsistent")).toBeDefined();
        expect(lipwig.find(parsedBibtex, "article_abbreviation")).toBeDefined();

        done();
      });
    });

    it("should return a false if no errors was found", function(done) {
      orangutan.parse(bibtexCleanData, false, function(parsedBibtex) {
        expect(parsedBibtex).toBe(false);

        done();
      });
    });
  });

  describe("when setting OPTOrangutan", function() {
    it("to OK, it should unconditionally accept the input", function(done) {
      orangutan.parse(bibtexOverrides, false, function(parsedBibtex) {
        expect(lipwig.find(parsedBibtex, "article_missing_two")).toBeDefined();
        expect(lipwig.find(parsedBibtex, "article_missing_two_override")).toBe(false);

        expect(lipwig.find(parsedBibtex, "article_missing_all")).toBeDefined();
        expect(lipwig.find(parsedBibtex, "article_missing_all_override")).toBe(false);

        expect(lipwig.find(parsedBibtex, "abbreviation_potato")).toBeDefined();
        expect(lipwig.find(parsedBibtex, "abbreviation_potato_override")).toBe(false);

        expect(lipwig.find(parsedBibtex, "abbreviation_airborne")).toBeDefined();
        expect(lipwig.find(parsedBibtex, "abbreviation_airborne_override")).toBe(false);

        expect(lipwig.find(parsedBibtex, "misspelling")).toBeDefined();
        expect(lipwig.find(parsedBibtex, "misspelling_override")).toBe(false);

        done();
      });
    });
  });
});
