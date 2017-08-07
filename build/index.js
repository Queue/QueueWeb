'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressReload = require('express-reload');

var _expressReload2 = _interopRequireDefault(_expressReload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.get('/', function (req, res) {
  res.send('Hello WOrld!!!!');
});

app.listen(3000, function () {
  console.log('Queue App is running on http://localhost:3000');
});