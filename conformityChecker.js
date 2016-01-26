const fs = require("fs");
const path = require("path");
const weatherwax = require("./weatherwax.js");
const banana = require("./banana.js");
const directory = path.dirname(fs.realpathSync(__filename));

const rulesDir = path.join(directory, "conformityRules");

module.exports = (function() {
  var ready = false;
  var conformityRules = {};
  var queuedConformityChecks = [];

  fs.readdir(rulesDir, function(error, files) {
    var granny = weatherwax(function() {
      ready = true;

      banana.processArray(queuedConformityChecks, function(item) {
        checkConformity.apply(this, item);
      });
    });

    for (var i=0; i<files.length; i++) {
      var file = files[i];

      var filePath = path.join(rulesDir, file);
      fs.readFile(filePath, granny(function(error, data) {
        if (error) {
          console.error("Error reading the file abbreviations/journals.json. Message was: ", error);
          throw error;
        }

        banana.mergeInto(JSON.parse(data), conformityRules);
      }));
    }

    granny.run();
  });

  var checkConformity = function(entry, callback) {
    var orangutan = {};

    var ruleset = conformityRules[entry.entryType];
    if (ruleset) {
      ruleset = JSON.parse(JSON.stringify(ruleset));

      for (var tag in entry.entryTags) {
        if (!ruleset[tag]) {
          orangutan[tag] = {};
          orangutan[tag].specificationConformance = "Unspecified field";
        } else if (ruleset[tag].required) {
          delete ruleset[tag];
        } else {
          delete ruleset[tag];
        }
      }

      for (tag in ruleset) {
        if (ruleset[tag].required) {
          orangutan[tag] = {};
          orangutan[tag].specificationConformance = "Field is missing";
        }
      }
    }

    callback(orangutan);
  };

  return {
    checkConformity: function(entry, callback) {
      if (ready) {
        checkConformity(entry, callback);
      } else {
        queuedConformityChecks.push([entry, callback]);
      }
    }
  };
})();
