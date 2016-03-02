const fs = require("fs");
const consistency = require("./consistency.js");

fs.readFile("./bibtex-tests/abbreviations.bib", function(error, data) {
  if (error) {
    console.error(error);
    return;
  }

  consistency.parse(data.toString(), function(pb) {

  });
});
