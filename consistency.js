const parser = require("bibtex-parse-js");
const weatherwax = require("./modules/weatherwax.js");
const banana = require("./modules/banana.js");
const oranParser = require("./bibtexParser.js");
const preparse = require("./modules/preparser.js");

module.exports = {
  doParsing: function(entry, strings, callback) {
    var orangutan = {};

    if (entry.entryTags.optorangutan) {
      if (entry.config.ok) {
        callback(orangutan);
        return;
      }
    }

    const granny = weatherwax(function() {
      callback(orangutan);
    });

    const orangutanCallback = function() {
      return granny(function(result) {
        banana.mergeInto(result, orangutan);
      });
    };

    granny.run();
  },

  createCallback: oranParser.createCallback,
  parse: oranParser.parse
};
