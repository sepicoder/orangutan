const fs = require("fs");
const orangutan = require("../consistency.js");
const preparser = require("../modules/preparser.js");

describe("When creating the data structure for consistency it", function() {
  var bibtexData;

  beforeAll(function(done) {
    fs.readFile("./bibtex-tests/consistencyStructure.bib", function(error, data) {
      bibtexData = data.toString();

      done();
    });
  });

  xdescribe("should detect inconsistencies between same journal", function() {

  });

  describe("should keep proper statistics for", function() {
    it("total amount of entries", function(done) {
      preparser.parse(bibtexData, function(oran) {
        expect(oran.statistics).toBeDefined();

        expect(oran.statistics.count).toBe(58);

        done();
      });
    });

    it("total amount of articles", function(done) {
      preparser.parse(bibtexData, function(oran) {
        expect(oran.statistics.article).toBeDefined();
        expect(oran.statistics.article.count).toBe(11);

        expect(oran.statistics.book).toBeDefined();
        expect(oran.statistics.book.count).toBe(10);

        expect(oran.statistics.booklet).toBeDefined();
        expect(oran.statistics.booklet.count).toBe(1);

        expect(oran.statistics.inbook).toBeDefined();
        expect(oran.statistics.inbook.count).toBe(3);

        expect(oran.statistics.incollection).toBeDefined();
        expect(oran.statistics.incollection.count).toBe(3);

        expect(oran.statistics.inproceedings).toBeDefined();
        expect(oran.statistics.inproceedings.count).toBe(6);

        expect(oran.statistics.manual).toBeDefined();
        expect(oran.statistics.manual.count).toBe(4);

        expect(oran.statistics.mastersthesis).toBeDefined();
        expect(oran.statistics.mastersthesis.count).toBe(3);

        expect(oran.statistics.misc).toBeDefined();
        expect(oran.statistics.misc.count).toBe(5);

        expect(oran.statistics.proceedings).toBeDefined();
        expect(oran.statistics.proceedings.count).toBe(6);

        expect(oran.statistics.phdthesis).toBeDefined();
        expect(oran.statistics.phdthesis.count).toBe(4);

        expect(oran.statistics.techreport).toBeDefined();
        expect(oran.statistics.techreport.count).toBe(9);

        expect(oran.statistics.unpublished).toBeDefined();
        expect(oran.statistics.unpublished.count).toBe(3);
      });
    });
  });
});
