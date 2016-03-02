const aspell = require('aspell');
const weatherwax = require('../weatherwax.js');

module.exports = (function() {
  var traceMode;

  var toPureText = function(entryTag) {
    var text = "";

    for (var i = 0; i<entryTag.length; i++) {
      var part = entryTag[i];

      if (part.type === "text") {
        text += part.part;
      } else if (part.type === "string"){
        // Lookup string
      } else {
        // We're not happy
      }
    }

    return text;
  };

  var checkerInstance = function(entryTag, lang, callback) {
    var checker = {};
    var wordCount = 0;
    var misspellingCount = 0;
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
        misspellings[misspellings.length-1].push(result);
      } else if (type === "comment" && traceMode) {
        console.log("*********************");
        console.log("Comment");
        console.log(result.line);
        console.log("*********************");
      } else if (type === "line-break") {
        misspellings.push([]);
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

    aspell.args.push("--encoding=UTF-8");
    aspell.args.push("--home-dir=aspell/");
    aspell.args.push("-t");
    aspell.args.push("-l" + lang);
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
    var lang;
    if (entry.config.lang) {
      lang = entry.config.lang[0];
    } else {
      lang = "en";
    }

    if (entryTags["title"]) {
      var entryTag = entryTags["title"]; ;
      var pureText = toPureText(entryTag).replace(/\{([^{}]*)\}/g, "$1");
      checkerInstance(pureText, lang, entryTagCallback("title"));
    }

    granny.run();
  };

  return {
    checkSpelling: checkSpelling
  };
})();
