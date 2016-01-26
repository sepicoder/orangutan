var Jasmine = require('jasmine');
var jasmine = new Jasmine();

jasmine.loadConfigFile("tests/config/jasmine.json");
jasmine.execute(["tests/incorrectnesstest.js"], "should detect optional fields");
