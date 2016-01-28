const spellChecker = require("./spellChecker.js");
const parser = require("bibtex-parse-js");
const weatherwax = require("./weatherwax.js");
const banana = require("./banana.js");
const abbreviationChecker = require("./abbreviationChecker.js");
const conformityChecker = require("./conformityChecker.js");

module.exports = {
  createCallback: function(entry) {
    return function(res) {
      entry.orangutan = res;
    };
  },

  doParsing: function(entry, parsedBibtex, callback) {
    var orangutan = {};

    const granny = weatherwax(function() {
      callback(orangutan);
    });

    const orangutanCallback = function() {
      return granny(function(result) {
        banana.mergeInto(result, orangutan);
      });
    };

    spellChecker.checkSpelling(entry, orangutanCallback());
    conformityChecker.checkConformity(entry, orangutanCallback());
    abbreviationChecker.checkAbbreviations(entry, parsedBibtex.strings, false, orangutanCallback());

    granny.run();
  },

  parse: function(bibtex, callback) {
    if (arguments.length < 2) {
      throw new RangeError("To few arguments given, should at least be a string with bibtex and a callback");
    } else if (arguments.length > 3) {
      throw new RangeError("To many arguments given, should at most be a string with bibtex, if it should keep the entries and a callback");
    }

    try {
      const parsedBibTeX = parser.toJSON(bibtex);

      const granny = weatherwax(function() {
        callback(parsedBibTeX);
      });

      for (var i=0; i<parsedBibTeX.entries.length; i++) {
        var entry = parsedBibTeX.entries[i];
        this.doParsing(entry, parsedBibTeX, granny(this.createCallback(entry)));
      }

      granny.run();
    } catch(error) {
      console.error(error.stack);
    }
  }
};
