const fs = require("fs");
const orangutan = require("../bibtexParser.js");

describe("When checking for the comformity of the BibTeX specification,", function() {
  var bibtexData;

  var find = function(parsedBibtex, key) {
    for (var i=0; i<parsedBibtex.entries.length; i++) {
      if (parsedBibtex.entries[i].citationKey === key)
        return parsedBibtex.entries[i];
    }

    return false;
  };

  beforeAll(function(done) {
    fs.readFile("./bibtex-tests/incompleteness.bib", function(error, data) {
      bibtexData = data.toString();
      done();
    });
  });

  describe("in", function() {
    /*
     * =======
     * ARTICLE
     * =======
     * Required fields: author, title, journal, year
     * Optional fields: volume, number, pages, month, note, key
     */
    describe("an article", function() {
      it("should detect an missing author", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var orangutan = find(parsedBibtex, "article_missing_author").orangutan;

          expect(orangutan.author.specificationConformance)
            .toEqual({
              description: "Field is missing",
              code: orangutan.conformance.MISSING_FIELD,
              alternative: "editor"
            });
          expect(orangutan.title.specificationConformance)
            .not.toBeDefined();
          expect(orangutan.journal)
            .not.toBeDefined();
          expect(orangutan.year)
            .not.toBeDefined();

          done();
        });
      });

      it("should detect a missing title", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var mt = find(parsedBibtex, "article_missing_title");
          var orangutan = mt.orangutan;

          expect(orangutan.author)
            .not.toBeDefined();
          expect(orangutan.title.specificationConformance)
            .toEqual({
              description: "Field is missing",
              code: orangutan.conformance.MISSING_FIELD
            });
          expect(orangutan.journal)
            .not.toBeDefined();
          expect(orangutan.year)
            .not.toBeDefined();

          done();
        });
      });

      it("should detect a missing journal", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var orangutan = find(parsedBibtex, "article_missing_journal").orangutan;

          expect(orangutan.author)
            .not.toBeDefined();
          expect(orangutan.title)
            .not.toBeDefined();
          expect(orangutan.journal.specificationConformance)
           .toEqual({
              description: "Field is missing",
              code: orangutan.conformance.MISSING_FIELD
            });
          expect(orangutan.year)
           .not.toBeDefined();

          done();
        });
      });

      it("should detect a missing year", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var orangutan = find(parsedBibtex, "article_missing_year").orangutan;

          expect(orangutan.author)
            .not.toBeDefined();
          expect(orangutan.title)
            .not.toBeDefined();
          expect(orangutan.journal)
            .not.toBeDefined();
          expect(orangutan.year.specificationConformance)
            .toEqual({
              description: "Field is missing",
              code: orangutan.conformance.MISSING_FIELD
            });

          done();
        });
      });

      it("should detect when mandatory is present", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var orangutan = find(parsedBibtex, "article_mandatory_only").orangutan;

          expect(orangutan.author)
            .not.toBeDefined();
          expect(orangutan.title)
            .not.toBeDefined();
          expect(orangutan.journal)
            .not.toBeDefined();
          expect(orangutan.year)
            .not.toBeDefined();

          done();
        });
      });

      it("should detect two fields are missing", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var orangutan = find(parsedBibtex, "article_missing_two").orangutan;

          expect(orangutan.author)
            .not.toBeDefined();
          expect(orangutan.title)
            .not.toBeDefined();
          expect(orangutan.journal.specificationConformance)
            .toEqual({
              description: "Field is missing",
              code: orangutan.conformance.MISSING_FIELD
            });
          expect(orangutan.year.specificationConformance)
            .toEqual("Field is missing");

          done();
        });
      });

      it("should flag unknown tags", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var orangutan = find(parsedBibtex, "article_unknown_tags").orangutan;

          expect(orangutan.ministry.specificationConformance)
            .toEqual("Unspecified field");
          expect(orangutan.friend.specificationConformance)
            .toEqual("Unspecified field");

          done();
        });
      });

      it("should detect optional fields", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var orangutan = find(parsedBibtex, "article_complete").orangutan;
          expect(orangutan.volume)
            .not.toBeDefined();
          expect(orangutan.number)
            .not.toBeDefined();
          expect(orangutan.pages)
            .not.toBeDefined();
          expect(orangutan.month)
            .not.toBeDefined();
          expect(orangutan.note)
            .not.toBeDefined();
          expect(orangutan.key)
            .not.toBeDefined();

          orangutan = find(parsedBibtex, "article_missing_title").orangutan;
          expect(orangutan.number)
            .not.toBeDefined();
          expect(orangutan.pages)
            .not.toBeDefined();
          expect(orangutan.key)
            .not.toBeDefined();

          orangutan = find(parsedBibtex, "article_missing_journal").orangutan;
          expect(orangutan.volume)
            .not.toBeDefined();
          expect(orangutan.number)
            .not.toBeDefined();
          expect(orangutan.note)
            .not.toBeDefined();
          expect(orangutan.key)
            .not.toBeDefined();

          orangutan = find(parsedBibtex, "article_missing_all").orangutan;
          expect(orangutan.volume)
            .not.toBeDefined();
          expect(orangutan.number)
            .not.toBeDefined();
          expect(orangutan.pages)
            .not.toBeDefined();
          expect(orangutan.month)
            .not.toBeDefined();

          done();
        });
      });

      it("should not do anything on missing optional fields", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var orangutan = find(parsedBibtex, "article_mandatory_only").orangutan;
          expect(orangutan.volume)
            .not.toBeDefined();
          expect(orangutan.number)
            .not.toBeDefined();
          expect(orangutan.pages)
            .not.toBeDefined();
          expect(orangutan.month)
            .not.toBeDefined();
          expect(orangutan.note)
            .not.toBeDefined();
          expect(orangutan.key)
            .not.toBeDefined();

          orangutan = find(parsedBibtex, "article_missing_author").orangutan;
          expect(orangutan.number)
            .not.toBeDefined();
          expect(orangutan.note)
            .not.toBeDefined();
          expect(orangutan.key)
            .not.toBeDefined();

          orangutan = find(parsedBibtex, "article_missing_two").orangutan;
          expect(orangutan.volume)
            .not.toBeDefined();
          expect(orangutan.number)
            .not.toBeDefined();
          expect(orangutan.pages)
            .not.toBeDefined();
          expect(orangutan.key)
            .not.toBeDefined();

          orangutan = find(parsedBibtex, "article_missing_all").orangutan;
          expect(orangutan.volume)
            .not.toBeDefined();
          expect(orangutan.number)
            .not.toBeDefined();
          expect(orangutan.pages)
            .not.toBeDefined();
          expect(orangutan.month)
            .not.toBeDefined();

          done();
        });
      });
    });

    /*
     * ====
     * BOOK
     * ====
     * Required fields: author or editor, title, publisher, year
     * Optional fields: volume, series, address, edition, month, note, key
     */
    describe("a book", function() {
      it("should detect an missing author", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var orangutan = find(parsedBibtex, "book_missing_author").orangutan;

          expect(orangutan.author.specificationConformance)
            .toEqual("Field is missing");
          expect(orangutan.title)
            .not.toBeDefined();
          expect(orangutan.publisher)
            .not.toBeDefined();
          expect(orangutan.year)
            .not.toBeDefined();

          done();
        });
      });

      it("should detect a missing title", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var mt = find(parsedBibtex, "book_missing_title");
          var orangutan = mt.orangutan;

          expect(orangutan.author)
            .not.toBeDefined();
          expect(orangutan.title.specificationConformance)
            .toEqual("Field is missing");
          expect(orangutan.publisher)
            .not.toBeDefined();
          expect(orangutan.year)
            .not.toBeDefined();

          done();
        });
      });

      it("should detect a missing publisher", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var orangutan = find(parsedBibtex, "book_missing_publisher").orangutan;

          expect(orangutan.author)
            .not.toBeDefined();
          expect(orangutan.title)
            .not.toBeDefined();
          expect(orangutan.publisher.specificationConformance)
           .toEqual("Field is missing");
          expect(orangutan.year)
           .not.toBeDefined();

          done();
        });
      });

      it("should detect a missing year", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var orangutan = find(parsedBibtex, "book_missing_year").orangutan;

          expect(orangutan.author)
            .not.toBeDefined();
          expect(orangutan.title)
            .not.toBeDefined();
          expect(orangutan.publisher)
            .not.toBeDefined();
          expect(orangutan.year.specificationConformance)
            .toEqual("Field is missing");

          done();
        });
      });

      it("should detect when mandatory is present", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var orangutan = find(parsedBibtex, "book_mandatory_only_author").orangutan;

          expect(orangutan.author)
            .not.toBeDefined();
          // Note the spell checker discovers one here
          expect(orangutan.title.specificationConformance)
            .not.toBeDefined();
          expect(orangutan.publisher)
            .not.toBeDefined();
          expect(orangutan.year)
            .not.toBeDefined();

          done();
        });
      });

      it("should detect two fields are missing", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var orangutan = find(parsedBibtex, "book_missing_two").orangutan;

          expect(orangutan.author)
            .not.toBeDefined();
          expect(orangutan.title.specificationConformance)
            .toEqual("Field is missing");
          expect(orangutan.publisher.specificationConformance)
            .toEqual("Field is missing");
          expect(orangutan.year)
            .not.toBeDefined();

          done();
        });
      });

      it("should flag unknown tags", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var orangutan = find(parsedBibtex, "article_unknown_tags").orangutan;

          expect(orangutan.ministry.specificationConformance)
            .toEqual("Unspecified field");
          expect(orangutan.friend.specificationConformance)
            .toEqual("Unspecified field");

          done();
        });
      });

      it("should detect optional fields", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var orangutan = find(parsedBibtex, "book_complete_author").orangutan;
          expect(orangutan.volume)
            .not.toBeDefined();
          expect(orangutan.series)
            .not.toBeDefined();
          expect(orangutan.address)
            .not.toBeDefined();
          expect(orangutan.edition)
            .not.toBeDefined();
          expect(orangutan.month)
            .not.toBeDefined();
          expect(orangutan.note)
            .not.toBeDefined();
          expect(orangutan.key)
            .not.toBeDefined();

          orangutan = find(parsedBibtex, "book_missing_title").orangutan;
          expect(orangutan.address)
            .not.toBeDefined();
          expect(orangutan.edition)
            .not.toBeDefined();
          expect(orangutan.note)
            .not.toBeDefined();

          orangutan = find(parsedBibtex, "book_missing_publisher").orangutan;
          expect(orangutan.series)
            .not.toBeDefined();

          done();
        });
      });

      it("should not do anything on missing optional fields", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var orangutan = find(parsedBibtex, "article_mandatory_only").orangutan;
          expect(orangutan.volume)
            .not.toBeDefined();
          expect(orangutan.number)
            .not.toBeDefined();
          expect(orangutan.pages)
            .not.toBeDefined();
          expect(orangutan.month)
            .not.toBeDefined();
          expect(orangutan.note)
            .not.toBeDefined();
          expect(orangutan.key)
            .not.toBeDefined();

          orangutan = find(parsedBibtex, "article_missing_author").orangutan;
          expect(orangutan.number)
            .not.toBeDefined();
          expect(orangutan.note)
            .not.toBeDefined();
          expect(orangutan.key)
            .not.toBeDefined();

          orangutan = find(parsedBibtex, "article_missing_two").orangutan;
          expect(orangutan.volume)
            .not.toBeDefined();
          expect(orangutan.number)
            .not.toBeDefined();
          expect(orangutan.pages)
            .not.toBeDefined();
          expect(orangutan.key)
            .not.toBeDefined();

          orangutan = find(parsedBibtex, "article_missing_all").orangutan;
          expect(orangutan.volume)
            .not.toBeDefined();
          expect(orangutan.number)
            .not.toBeDefined();
          expect(orangutan.pages)
            .not.toBeDefined();
          expect(orangutan.month)
            .not.toBeDefined();

          done();
        });
      });

      xit("should not accept author and editor in the same", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var orangutan = find(parsedBibtex, "book_author_editor").orangutan;

          expect(orangutan.author.specificationConformance)
            .toBe({
              description: "",
              code: 3,
              field: "editor"
            });
          expect(orangutan.editor.specificationConformance)
            .toBe({
              description: "",
              code: 3,
              field: "author"
            });

          orangutan = find(parsedBibtex, "book_complete_author_editor").orangutan;

          done();
        });
      });

      it("should not accept if editor is present in stead of author", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var orangutan = find(parsedBibtex, "book_complete_editor").orangutan;

          expect(orangutan.author)
            .not.toBeDefined();
          expect(orangutan.editor)
            .not.toBeDefined();

          orangutan = find(parsedBibtex, "book_mandatory_only_editor").orangutan;

          expect(orangutan.author)
            .not.toBeDefined();
          expect(orangutan.editor)
            .not.toBeDefined();


          done();
        });
      });
    });

    /*
     * =======
     * booklet
     * =======
     * required fields: title
     * Optional fields: author, howpublished, address, month, year, note, key
     */
    xdescribe("a booklet", function() {

    });
  });
});
