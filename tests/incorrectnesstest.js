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
          var oran = find(parsedBibtex, "article_missing_author").orangutan;

          expect(oran.author.specificationConformance)
            .toEqual({
              description: "Field is missing",
              code: orangutan.conformanceCodes.MISSING_FIELD
            });
          expect(oran.title.specificationConformance)
            .not.toBeDefined();
          expect(oran.journal)
            .not.toBeDefined();
          expect(oran.year)
            .not.toBeDefined();

          done();
        });
      });

      it("should detect a missing title", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var mt = find(parsedBibtex, "article_missing_title");
          var oran = mt.orangutan;

          expect(oran.author)
            .not.toBeDefined();
          expect(oran.title.specificationConformance)
            .toEqual({
              description: "Field is missing",
              code: orangutan.conformanceCodes.MISSING_FIELD
            });
          expect(oran.journal)
            .not.toBeDefined();
          expect(oran.year)
            .not.toBeDefined();

          done();
        });
      });

      it("should detect a missing journal", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "article_missing_journal").orangutan;

          expect(oran.author)
            .not.toBeDefined();
          expect(oran.title)
            .not.toBeDefined();
          expect(oran.journal.specificationConformance)
            .toEqual({
              description: "Field is missing",
              code: orangutan.conformanceCodes.MISSING_FIELD
            });
          expect(oran.year)
            .not.toBeDefined();

          done();
        });
      });

      it("should detect a missing year", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "article_missing_year").orangutan;

          expect(oran.author)
            .not.toBeDefined();
          expect(oran.title)
            .not.toBeDefined();
          expect(oran.journal)
            .not.toBeDefined();
          expect(oran.year.specificationConformance)
            .toEqual({
              description: "Field is missing",
              code: orangutan.conformanceCodes.MISSING_FIELD
            });

          done();
        });
      });

      it("should detect when mandatory is present", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "article_mandatory_only").orangutan;

          expect(oran.author)
            .not.toBeDefined();
          expect(oran.title)
            .not.toBeDefined();
          expect(oran.journal)
            .not.toBeDefined();
          expect(oran.year)
            .not.toBeDefined();

          done();
        });
      });

      it("should detect two fields are missing", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "article_missing_two").orangutan;

          expect(oran.author)
            .not.toBeDefined();
          expect(oran.title)
            .not.toBeDefined();
          expect(oran.journal.specificationConformance)
            .toEqual({
              description: "Field is missing",
              code: orangutan.conformanceCodes.MISSING_FIELD
            });
          expect(oran.year.specificationConformance)
            .toEqual({
              description: "Field is missing",
              code: orangutan.conformanceCodes.MISSING_FIELD
            });

          done();
        });
      });

      it("should flag unknown tags", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "article_unknown_tags").orangutan;

          expect(oran.ministry.specificationConformance)
            .toEqual({
              description: "Unspecified field",
              code: orangutan.conformanceCodes.UNSPECIFIED_FIELD
            });
          expect(oran.friend.specificationConformance)
            .toEqual({
              description: "Unspecified field",
              code: orangutan.conformanceCodes.UNSPECIFIED_FIELD
            });

          done();
        });
      });

      it("should detect optional fields", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "article_complete").orangutan;
          expect(oran.volume)
            .not.toBeDefined();
          expect(oran.number)
            .not.toBeDefined();
          expect(oran.pages)
            .not.toBeDefined();
          expect(oran.month)
            .not.toBeDefined();
          expect(oran.note)
            .not.toBeDefined();
          expect(oran.key)
            .not.toBeDefined();

          orangutan = find(parsedBibtex, "article_missing_title").orangutan;
          expect(oran.number)
            .not.toBeDefined();
          expect(oran.pages)
            .not.toBeDefined();
          expect(oran.key)
            .not.toBeDefined();

          orangutan = find(parsedBibtex, "article_missing_journal").orangutan;
          expect(oran.volume)
            .not.toBeDefined();
          expect(oran.number)
            .not.toBeDefined();
          expect(oran.note)
            .not.toBeDefined();
          expect(oran.key)
            .not.toBeDefined();

          orangutan = find(parsedBibtex, "article_missing_all").orangutan;
          expect(oran.volume)
            .not.toBeDefined();
          expect(oran.number)
            .not.toBeDefined();
          expect(oran.pages)
            .not.toBeDefined();
          expect(oran.month)
            .not.toBeDefined();

          done();
        });
      });

      it("should not do anything on missing optional fields", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "article_mandatory_only").orangutan;
          expect(oran.volume)
            .not.toBeDefined();
          expect(oran.number)
            .not.toBeDefined();
          expect(oran.pages)
            .not.toBeDefined();
          expect(oran.month)
            .not.toBeDefined();
          expect(oran.note)
            .not.toBeDefined();
          expect(oran.key)
            .not.toBeDefined();

          oran = find(parsedBibtex, "article_missing_author").orangutan;
          expect(oran.number)
            .not.toBeDefined();
          expect(oran.note)
            .not.toBeDefined();
          expect(oran.key)
            .not.toBeDefined();

          oran = find(parsedBibtex, "article_missing_two").orangutan;
          expect(oran.volume)
            .not.toBeDefined();
          expect(oran.number)
            .not.toBeDefined();
          expect(oran.pages)
            .not.toBeDefined();
          expect(oran.key)
            .not.toBeDefined();

          oran = find(parsedBibtex, "article_missing_all").orangutan;
          expect(oran.volume)
            .not.toBeDefined();
          expect(oran.number)
            .not.toBeDefined();
          expect(oran.pages)
            .not.toBeDefined();
          expect(oran.month)
            .not.toBeDefined();

          done();
        });
      });
    });

    /*
     * ====
     * BOOK
     * ====
     */
    describe("a book", function() {
      it("should detect an missing author", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "book_missing_author").orangutan;

          expect(oran.author.specificationConformance)
            .toEqual({
              description: "Field is missing",
              code: orangutan.conformanceCodes.MISSING_FIELD,
              alternative: "editor"
            });
          expect(oran.title)
            .not.toBeDefined();
          expect(oran.publisher)
            .not.toBeDefined();
          expect(oran.year)
            .not.toBeDefined();

          done();
        });
      });

      it("should detect a missing title", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var mt = find(parsedBibtex, "book_missing_title");
          var oran = mt.orangutan;

          expect(oran.author)
            .not.toBeDefined();
          expect(oran.editor)
            .not.toBeDefined();
          expect(oran.title.specificationConformance)
            .toEqual({
              description: "Field is missing",
              code: orangutan.conformanceCodes.MISSING_FIELD
            });
          expect(oran.publisher)
            .not.toBeDefined();
          expect(oran.year)
            .not.toBeDefined();

          done();
        });
      });

      it("should detect a missing publisher", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "book_missing_publisher").orangutan;

          expect(oran.author)
            .not.toBeDefined();
          expect(oran.editor)
            .not.toBeDefined();
          expect(oran.title)
            .not.toBeDefined();
          expect(oran.publisher.specificationConformance)
            .toEqual({
              description: "Field is missing",
              code: orangutan.conformanceCodes.MISSING_FIELD
            });
          expect(oran.year)
           .not.toBeDefined();

          done();
        });
      });

      it("should detect a missing year", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "book_missing_year").orangutan;

          expect(oran.author)
            .not.toBeDefined();
          expect(oran.editor)
            .not.toBeDefined();
          expect(oran.title)
            .not.toBeDefined();
          expect(oran.publisher)
            .not.toBeDefined();
          expect(oran.year.specificationConformance)
            .toEqual({
              description: "Field is missing",
              code: orangutan.conformanceCodes.MISSING_FIELD
            });

          done();
        });
      });

      it("should detect when mandatory is present", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "book_mandatory_only_author").orangutan;

          expect(oran.author)
            .not.toBeDefined();
          expect(oran.editor)
            .not.toBeDefined();
          // Note the spell checker discovers one here
          expect(oran.title.specificationConformance)
            .not.toBeDefined();
          expect(oran.publisher)
            .not.toBeDefined();
          expect(oran.year)
            .not.toBeDefined();

          done();
        });
      });

      it("should detect two fields are missing", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "book_missing_two").orangutan;

          expect(oran.author)
            .not.toBeDefined();
          expect(oran.editor)
            .not.toBeDefined();
          expect(oran.title.specificationConformance)
            .toEqual({
              description: "Field is missing",
              code: orangutan.conformanceCodes.MISSING_FIELD
            });
          expect(oran.publisher.specificationConformance)
            .toEqual({
              description: "Field is missing",
              code: orangutan.conformanceCodes.MISSING_FIELD
            });
          expect(oran.year)
            .not.toBeDefined();

          done();
        });
      });

      it("should flag unknown tags", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "article_unknown_tags").orangutan;

          expect(oran.ministry.specificationConformance)
            .toEqual({
              description: "Unspecified field",
              code: orangutan.conformanceCodes.UNSPECIFIED_FIELD
            });
          expect(oran.friend.specificationConformance)
            .toEqual({
              description: "Unspecified field",
              code: orangutan.conformanceCodes.UNSPECIFIED_FIELD
            });

          done();
        });
      });

      it("should detect optional fields", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "book_complete_author").orangutan;
          expect(oran.volume)
            .not.toBeDefined();
          expect(oran.series)
            .not.toBeDefined();
          expect(oran.address)
            .not.toBeDefined();
          expect(oran.edition)
            .not.toBeDefined();
          expect(oran.month)
            .not.toBeDefined();
          expect(oran.note)
            .not.toBeDefined();
          expect(oran.key)
            .not.toBeDefined();

          oran = find(parsedBibtex, "book_missing_title").orangutan;
          expect(oran.address)
            .not.toBeDefined();
          expect(oran.edition)
            .not.toBeDefined();
          expect(oran.note)
            .not.toBeDefined();

          oran = find(parsedBibtex, "book_missing_publisher").orangutan;
          expect(oran.series)
            .not.toBeDefined();

          done();
        });
      });

      it("should not do anything on missing optional fields", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "article_mandatory_only").orangutan;
          expect(oran.volume)
            .not.toBeDefined();
          expect(oran.number)
            .not.toBeDefined();
          expect(oran.pages)
            .not.toBeDefined();
          expect(oran.month)
            .not.toBeDefined();
          expect(oran.note)
            .not.toBeDefined();
          expect(oran.key)
            .not.toBeDefined();

          oran = find(parsedBibtex, "article_missing_author").orangutan;
          expect(oran.number)
            .not.toBeDefined();
          expect(oran.note)
            .not.toBeDefined();
          expect(oran.key)
            .not.toBeDefined();

          oran = find(parsedBibtex, "article_missing_two").orangutan;
          expect(oran.volume)
            .not.toBeDefined();
          expect(oran.number)
            .not.toBeDefined();
          expect(oran.pages)
            .not.toBeDefined();
          expect(oran.key)
            .not.toBeDefined();

          oran = find(parsedBibtex, "article_missing_all").orangutan;
          expect(oran.volume)
            .not.toBeDefined();
          expect(oran.number)
            .not.toBeDefined();
          expect(oran.pages)
            .not.toBeDefined();
          expect(oran.month)
            .not.toBeDefined();

          done();
        });
      });

      it("should not accept author and editor in the same", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "book_author_editor").orangutan;

          expect(oran.author.specificationConformance)
            .toEqual({
              description: "[author] and [editor] cannot be in the same entry",
              code: orangutan.conformanceCodes.EXCLUSIVE_FIELD,
              field: "editor"
            });
          expect(oran.editor.specificationConformance)
            .toEqual({
              description: "[editor] and [author] cannot be in the same entry",
              code: orangutan.conformanceCodes.EXCLUSIVE_FIELD,
              field: "author"
            });

          oran = find(parsedBibtex, "book_complete_author_editor").orangutan;

          done();
        });
      });

      it("should not accept if editor is present in stead of author", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "book_complete_editor").orangutan;

          expect(oran.author)
            .not.toBeDefined();
          expect(oran.editor)
            .not.toBeDefined();

          oran = find(parsedBibtex, "book_mandatory_only_editor").orangutan;

          expect(oran.author)
            .not.toBeDefined();
          expect(oran.editor)
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
    describe("a booklet", function() {
      it("should not show anything when it conforms", function(done) {
        orangutan.parse(bibtexData, false, function(parsedBibtex) {
          var oran = find(parsedBibtex, "booklet_complete");

          expect(oran).toEqual(false);

          oran = find(parsedBibtex, "booklet_mandatory_only");

          expect(oran).toEqual(false);

          done();
        });
      });

      it("should mark when title is missing", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "booklet_missing_title").orangutan;

          expect(oran.title.specificationConformance).toEqual({
            description: "Field is missing",
            code: orangutan.conformanceCodes.MISSING_FIELD
          });

          done();
        });
      });

      it("should mark unknown fields", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "booklet_missing_title").orangutan;

          oran = find(parsedBibtex, "booklet_as_book").orangutan;

          expect(oran.editor.specificationConformance).toEqual({
            description: "Unspecified field",
            code: orangutan.conformanceCodes.UNSPECIFIED_FIELD
          });
          expect(oran.publisher.specificationConformance).toEqual({
            description: "Unspecified field",
            code: orangutan.conformanceCodes.UNSPECIFIED_FIELD
          });

          done();
        });
      });
    });

    /*
     * ======
     * inbook
     * ======
     */
    describe("an inbook", function() {
      it("should accept the required fields with chapter present", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, false, "inbook_complete_chapter");

          expect(oran).toEqual(false);

          done();
        });
      });

      it("should accept the required fields with pages present", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "inbook_complete_pages");

          expect(oran.author).not.toBeDefined();
          expect(oran.editor).not.toBeDefined();
          expect(oran.title).not.toBeDefined();
          expect(oran.chapter).not.toBeDefined();
          expect(oran.pages).not.toBeDefined();
          expect(oran.publisher).not.toBeDefined();
          expect(oran.year).not.toBeDefined();
          expect(oran.volume).not.toBeDefined();
          expect(oran.series).not.toBeDefined();
          expect(oran.address).not.toBeDefined();
          expect(oran.edition).not.toBeDefined();
          expect(oran.month).not.toBeDefined();
          expect(oran.note).not.toBeDefined();
          expect(oran.key).not.toBeDefined();

          done();
        });
      });

      it("should accept the required fields with chapter and pages present", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "inbook_complete_chapter_pages");

          expect(oran.author).not.toBeDefined();;
          expect(oran.title).not.toBeDefined();
          expect(oran.chapter).not.toBeDefined();
          expect(oran.pages).not.toBeDefined();

          done();
        });
      });

      it("should fail if both chapter and pages is missing with a notion of the alternative", function(done) {
        orangutan.parse(bibtexData, function(parsedBibtex) {
          var oran = find(parsedBibtex, "inbook_missing_chapter_pages").orangutan;

          expect(oran.chapter.specificationConformance).toBeDefined();
          expect(oran.pages.specificationConformance).toBeDefined();

          expect(oran.chapter.specificationConformance).toEqual({
            description: "Field is missing with alternative option [pages]",
            code: orangutan.conformanceCodes.MISSING_WITH_ALTERNATIVE_FIELD,
            field: "pages"
          });
          expect(oran.pages.specificationConformance).toEqual({
            description: "Field is missing with alternative option [chapter]",
            code: orangutan.conformanceCodes.MISSING_WITH_ALTERNATIVE_FIELD,
            field: "chapter"
          });

          done();
        });
      });
    });

    xdescribe("When running in to OPT* fields it", function() {
      it("should ignore them by default");
      it("should mark them specifically marked");
      it("should mark all except OPTorangutan if the rule is overruled");
    });
  });
});
