const fs = require("fs");
const weatherwax = require("./weatherwax.js");
const banana = require("./banana.js");

module.exports = (function() {

  var ready = false;
  var shortnings = {
    general: {}
  };
  var queuedShortningChecks = [];

  fs.readFile('abbreviations/journals.json', function(error, data) {
    if (error) {
      console.error("Error reading the file abbreviations/journals.json. Message was: ", error);
      throw error;
    }

    shortnings.journal = JSON.parse(data);

    ready = true;

    banana.processArray(queuedShortningChecks, function(item) {
      doAbbreviationSearch.apply(this, item);
    });
  });

  var doAbbreviationSearch = function(entryTag, strings, heusterics, callback) {
    var abbreviations = {
      abbreviation: [],
      suggestions: {}
    };

    for (var string in strings) {
      if (shortnings[string])
        shortnings[string].push(strings[string]);
      else
        shortnings[string] = [strings[string]];
    }

    // Todo make further independent to use external lists
    var checkShortning = function(shortning, shortnings) {
      if (shortnings[shortning]) {
        abbreviations.abbreviation.push(shortning);

        if (!abbreviations.suggestions[shortning])
          abbreviations.suggestions[shortning] = [];

        abbreviations.suggestions[shortning] = abbreviations.suggestions[shortning].concat(shortnings[shortning]);
      }
    };

    var tokens = entryTag.split(" ");
    for (var i=0; i<tokens.length; i++) {
      var token = tokens[i].toLowerCase();

      checkShortning(token, shortnings.general);
    }
    checkShortning(entryTag.toLowerCase(), shortnings.journal);

    // Do deeper search, trying to find things hidden by dots etc.
    // this is likely to cause a lot of false positives (can we test that?)
    if (heusterics) {
      var alternativeTag = entryTag.replace("-", " ");
      alternativeTag = alternativeTag.replace(".", " ");
      alternativeTag = alternativeTag.replace(",", " ");

      tokens = alternativeTag.split(" ");
      for (i=0; i<tokens.length; i++) {
        token = tokens[i].toLowerCase();

        checkShortning(token, shortnings.general);
        checkShortning(token, shortnings.journal);
      }
    }

    callback(abbreviations);
  };

  return {
    checkAbbreviations: function(entry, strings, heusterics, callback) {
      var orangutan = {};

      const granny = weatherwax(function() {
        callback(orangutan);
      });

      for (var tag in entry.entryTags) {
        orangutan[tag] = {};

        var cb = (function(tag) {
          return granny(function(abbreviations) {
            orangutan[tag].abbreviations = abbreviations;
          });
        })(tag);

        var params = [entry.entryTags[tag], strings, heusterics, cb];
        if (ready) {
          doAbbreviationSearch.apply(this, params);
        }
        else {
          queuedShortningChecks.push(params);
        }
      }
      granny.run();
    }
  };
})();
