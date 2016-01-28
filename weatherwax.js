var weatherwax = function(finalCallback) {
  var count = 0;
  var runAhead = false;
  var ordered = false;
  var currentCallback = { next: null };
  var lastCallback = currentCallback;

  var createCallback = function(callback) {
    count++;

    var cbFunction = function() {
      count--;
      callback.apply(callback, arguments);

      if (count === 0 && runAhead) {
        finalCallback();
      }
    };

    lastCallback.next = {
      cbFunction: cbFunction,
      ready: false,
      arguments: [],
      next: null
    };
    lastCallback = lastCallback.next;

    var greebo = (function(actualCallback) {
      return function() {
        if (ordered) {
          actualCallback.ready = true;
          actualCallback.arguments = arguments;

          while (currentCallback.next && currentCallback.next.ready) {
            currentCallback = currentCallback.next;
            currentCallback.cbFunction.apply(currentCallback.cbFunction, currentCallback.arguments);
          }
        } else {
          actualCallback.cbFunction.apply(actualCallback.cbFunction, arguments);
        }
      };
    })(lastCallback);

    return greebo;
  };

  createCallback.setOrdered = function(o) {
    ordered = o;
  };
  createCallback.run = function() {
    runAhead = true;
    if (count === 0)
      finalCallback();
  };

  return createCallback;
};

module.exports = weatherwax;
