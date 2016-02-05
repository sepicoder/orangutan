var fs = require("fs");
var orangutan = require("../bibtexParser.js");
var lipwig = require("./lipwig.js");

describe("When searching for spelling errors", function() {
  var bibtexData;

  beforeAll(function(done) {
    fs.readFile("./bibtex-tests/misspellings.bib", function(error, data) {
      bibtexData = data.toString();
      done();
    });
  });

  it("finds 'Algorithm' typed as 'Algoritm'", function(done) {
    orangutan.parse(bibtexData, function(parsedBibtex) {
      var orangutan = lipwig.find(parsedBibtex, "ao_2005")
            .orangutan;
      var spell = orangutan.title.spelling;

      expect(spell.misspellingCount).toBe(1);
      var mispelling = spell.misspellings[0][0];
      expect(mispelling.word).toBe("Algoritm");
      expect(mispelling.position).toBe(10);
      expect(mispelling.alternatives.length).toBeGreaterThan(0);

      done();
    });
  });

  it("suggests 'Algorithm' when finding 'Algoritm'", function(done) {
    orangutan.parse(bibtexData, function(parsedBibtex) {
      var orangutan = lipwig.find(parsedBibtex, "ao_2005")
            .orangutan;
      var spell = orangutan.title.spelling;
      var mispelling = spell.misspellings[0][0];
      expect(mispelling.alternatives).toContain("Algorithm");

      done();
    });
  });

  it("finds 'Fictive' typed as 'Fictiive'", function(done) {
    orangutan.parse(bibtexData, function(parsedBibtex) {
      var orangutan = lipwig.find(parsedBibtex, "fictive")
            .orangutan;
      var spell = orangutan.title.spelling;

      expect(spell.misspellingCount).toBe(1);
      var mispelling = spell.misspellings[0][0];
      expect(mispelling.word).toBe("Fictiive");
      expect(mispelling.position).toBe(0);
      expect(mispelling.alternatives.length).toBeGreaterThan(0);

      done();
    });
  });

  it("suggests Fictive when finding Fictiive", function(done) {
    orangutan.parse(bibtexData, function(parsedBibtex) {
      var orangutan = lipwig.find(parsedBibtex, "fictive")
            .orangutan;
      var spell = orangutan.title.spelling;
      var mispelling = spell.misspellings[0][0];
      expect(mispelling.alternatives).toContain("Fictive");

      done();
    });
  });

  it("does not have a spelling tag if no erros is found", function(done) {
    orangutan.parse(bibtexData, function(parsedBibtex) {
      var orangutan = lipwig.find(parsedBibtex, "correct_spelling")
            .orangutan;
      expect(orangutan.title).not.toBeDefined();

      done();
    });
  });

  it("does not give spelling errors when BibTeX literals is used", function(done) {
    orangutan.parse(bibtexData, function(parsedBibtex) {
      var orangutan = lipwig.find(parsedBibtex, "correct_spelling_with_literals")
            .orangutan;
      expect(orangutan.title).not.toBeDefined();

      done();
    });
  });

  it("should not detect spelling errors in the French title of The Little Prince", function(done) {
    orangutan.parse(bibtexData, function(parsedBibtex) {
      var orangutan = lipwig.find(parsedBibtex, "la_petite")
            .orangutan;
      expect(orangutan.title).not.toBeDefined();

      done();
    });
  });
});
