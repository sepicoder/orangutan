var weatherwax = function(finalCallback) {
  var callbacks = [];
  var count = 0;
  var runAhead = false;

  var createCallback = function(callback) {
    count++;
    callbacks.push(callback);

    return function() {
      count--;
      callback.apply(this, arguments);

      if (count === 0 && runAhead) {
        finalCallback();
      }
    };
  };

  createCallback.run = function() {
    runAhead = true;
    if (count === 0)
      finalCallback();
  };

  return createCallback;
};

module.exports = weatherwax;
