const aspell = require('aspell');
const weatherwax = require('./weatherwax.js');

module.exports = (function() {
  var traceMode;

  var checkerInstance = function(entryTag, callback) {
    var checker = {};
    var wordCount = 0;
    var misspellingCount = 0;
    var line = 0;
    var misspellings = [];
    misspellings[0] = [];

    var end = function() {
      callback(getStatus());
    };
    var error = function(chunk) {
      console.log("Error when running aspell:");
      console.log(chunk);
    };
    var resultHandler = function(result) {
      var type = result.type;
      wordCount++;

      if (type === "misspelling") {
        misspellingCount++;
        misspellings[line].push(result);
      } else if (type === "comment" && traceMode) {
        console.log("*********************");
        console.log("Comment");
        console.log(result.line);
        console.log("*********************");
      } else if (type === "line-break") {
        line++;
      } else if (type === "unknown") {
        console.log("*********************");
        console.log("Unknown");
        console.log(result);
        console.log("*********************");
      }
    };
    var getStatus = function() {
      return {
        wordCount: wordCount,
        misspellingCount: misspellingCount,
        misspellings: misspellings
      };
    };

    var emitter = aspell(entryTag);
    emitter.on("error", error)
      .on("result", resultHandler)
      .on("end", end);
  };

  var checkSpelling = function(entry, callback, trace) {
    traceMode = trace || false;
    var orangutan = {};
    const granny = weatherwax(function() {
      callback(orangutan);
    });

    var entryTagCallback = function(entryTag) {
      return granny(function(status) {
        if (status.misspellingCount > 0) {
          orangutan[entryTag] = {
            spelling: status
          };
        }
      });
    };

    var entryTags = entry.entryTags;
    for (var tag in entryTags) {
      if (tag === "year") continue;
      checkerInstance(entryTags[tag], entryTagCallback(tag));
    }

    granny.run();
  };

  return {
    checkSpelling: checkSpelling
  };
})();
