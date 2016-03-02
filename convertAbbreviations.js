const fs = require("fs");
const readline = require("readline");

var args = process.argv.slice(2);

if (args.length !== 2) {
  console.error("Bad amount of arguments for the abbreviation parser");
} else {
  const infile = args[0];
  const outfile = args[1];

  const inReader = readline.createInterface({
    input: fs.createReadStream(infile),
    output: process.stdout,
    terminal: false
  });

  var abbreviations = {};
  inReader.on("line", function(line) {
    var data = line.split("=");

    if (data.length !== 2){
            console.error("Error on: ", line);
    } else {
      var full = data[0].trim();
      var abbreviation = data[1].trim().toLowerCase();

      if (!abbreviations[abbreviation]) {
        abbreviations[abbreviation] = [];

      }

      abbreviations[abbreviation].push(full);
    }
  });

  inReader.on("close", function() {
    fs.writeFile(outfile, JSON.stringify(abbreviations), function(error) {
      if (error) {
        console.error("File writing error", error);
      }

      console.log("File was written");
    });
  });
}
