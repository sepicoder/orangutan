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
  var partialRules = {};
  var queuedConformityChecks = [];

  fs.readdir(rulesDir, function(error, files) {
    var granny = weatherwax(function() {
      ready = true;

      var rulesKeys = Object.keys(conformityRules);
      for (var item in partialRules) {
        var partialKey = item.substr(0, item.length-1);
        if (partialKey.indexOf("*") > -1) {
          throw new SyntaxError("Invalid syntax for the partial rule, only rules ending with a single star is allowed. Violating rule is [" + item + "]");
        }

        for (var i=0; i<rulesKeys.length; i++) {
          var ruleItem = rulesKeys[i];
          if (ruleItem.substr(0, partialKey.length) === partialKey) {
            banana.mergeInto(partialRules[item], conformityRules[ruleItem]);
          }
        }
      }

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

        var rules = JSON.parse(data);
        for (var item in rules) {
          var ruleItem;
          if (item.indexOf("*") > -1) {
            console.log("Star rule found!");
            ruleItem = (partialRules[item] || (partialRules[item] = {}));
          } else {
            ruleItem = (conformityRules[item] || (conformityRules[item] = {}));
          }

          banana.mergeInto(rules[item], ruleItem);
        }
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
        } else {
          if (tagRule.excludes) {
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
          } else if (tagRule.alternative) {
            if (ruleset[tagRule.alternative]) {
              ruleset[tagRule.alternative].required = false;
            }
          }

          delete ruleset[tag];
        }
      }

      for (tag in ruleset) {
        if (ruleset[tag].required && ruleset[tag].alternative) {
          orangutan[tag] = {
            specificationConformance: {
              description: "Field is missing with alternative option [" + ruleset[tag].alternative + "]",
              code: conformanceCodes.MISSING_WITH_ALTERNATIVE_FIELD,
              field: ruleset[tag].alternative
            }
          };
        } else if (ruleset[tag].required) {
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
