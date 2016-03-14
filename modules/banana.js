module.exports = (function() {
  var parseConfig = function(options) {
    var config = {};
    var opts = options.split("@");

    for (var i=0; i<opts.length; i++) {
      var option = opts[i];

      if (option) {
        var optArgs = option.split("=");

        if (optArgs.length > 1) {
          config[optArgs[0].toLowerCase()] = optArgs[1].split(",");
        } else {
          config[optArgs[0].toLowerCase()] = [];
        }
      }
    }

    return config;
  };

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

  var mergeInto = function(source, target) {
    for (var attr in source) {
      if (target[attr]) {
        mergeInto(source[attr], target[attr]);
      } else {
        target[attr] = source[attr];
      }
    }
  };

  return {
    parseConfig: parseConfig,
    processArray: processArray,
    mergeInto: mergeInto
  };
})();
