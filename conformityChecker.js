const fs = require("fs");
const weatherwax = require("./weatherwax.js");

var processArray = function(items, process) {
  var todo = items.concat();

  if (todo.length > 0) {
    setTimeout(function() {
      process(todo.shift());
      if(todo.length > 0) {
        setTimeout(arguments.callee, 25);
      }
    }, 25);
  }
};

module.exports = (function() {
  var ready = false;
  var conformityRules = {};
  var queuedConformityChecks = [];

  fs.readFile('abbreviations/journals.json', function(error, data) {
    if (error) {
      console.error("Error reading the file abbreviations/journals.json. Message was: ", error);
      throw error;
    }

    conformityRules = {
      article: {
        author: {
          required: true
        },
        title: {
          required: true
        },
        journal: {
          required: true
        },
        year: {
          required: true
        },
        volume: {
          required: false
        },
        number: {
          required: false
        },
        pages: {
          required: false
        },
        month: {
          required: false
        },
        note: {
          required: false
        },
        key: {
          required: false
        }
      }
    };

    ready = true;

    processArray(queuedConformityChecks, function(item) {
      checkConformity.apply(this, item);
    });
  });

  var checkConformity = function(entry, callback) {
    var orangutan = {};

    var ruleset = conformityRules[entry.entryType];
    if (ruleset) {
      ruleset = JSON.parse(JSON.stringify(ruleset));

      for (var tag in entry.entryTags) {
        orangutan[tag] = {};
        if (!ruleset[tag]) {
          orangutan[tag].specificationConformance = "Unspecified field";
        } else if (ruleset[tag].required) {
          orangutan[tag].specificationConformance = "OK";
          delete ruleset[tag];
        } else {
          orangutan[tag].specificationConformance = "OK";
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
