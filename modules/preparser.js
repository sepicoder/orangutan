module.exports = {
  parse: function(bibtex, callback) {
    var structure = {
      statistics: {
        count: 0
      }
    };

    for (var i=0; i<bibtex.entries.length ;i++) {
      var entryTag = bibtex.entries[i];

      structure.statistics.count++;
    }
  }
};
