const fs = require("fs");
const path = require("path");
const weatherwax = require("./weatherwax.js");
const banana = require("./banana.js");
const directory = path.dirname(fs.realpathSync(__filename));

const rulesDir = path.join(directory, "conformityRules");

module.exports = (function() {
  const conformanceCodes = {
    OK: 0,
    MISSING_FIELD: 1,
    UNSPECIFIED_FIELD: 2,
    EXCLUSIVE_FIELD: 3,
    MISSING_WITH_ALTERNATIVE_FIELD: 4
  };

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
        var tagRule = ruleset[tag];
        if (!tagRule) {
          orangutan[tag] = {
            specificationConformance: {
              description: "Unspecified field",
              code: conformanceCodes.UNSPECIFIED_FIELD
            }
          };
        } else if (tagRule.excludes) {
          if (entry.entryTags[tagRule.excludes]) {
            orangutan[tag] = {
              specificationConformance: {
                description: "[" + tag + "] and [" + tagRule.excludes + "] cannot be in the same entry",
                code: conformanceCodes.EXCLUSIVE_FIELD,
                field: tagRule.excludes
              }
            };
          } else {
            delete ruleset[tagRule.excludes];
          }

          delete ruleset[tag];
        } else if (tagRule.required) {
          delete ruleset[tag];
        } else {
          delete ruleset[tag];
        }
      }

      for (tag in ruleset) {
        if (ruleset[tag].required) {
          orangutan[tag] = {
            specificationConformance: {
              description: "Field is missing",
              code: conformanceCodes.MISSING_FIELD
            }
          };

          if (ruleset[tag].excludes) {
            orangutan[tag].specificationConformance.alternative = ruleset[tag].excludes;
          }
        }
      }
    }

    callback(orangutan);
  };

  return {
    conformanceCodes: conformanceCodes,

    checkConformity: function(entry, callback) {
      if (ready) {
        checkConformity(entry, callback);
      } else {
        queuedConformityChecks.push([entry, callback]);
      }
    }
  };
})();
