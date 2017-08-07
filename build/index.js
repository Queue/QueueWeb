'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.get('/', function (req, res) {
  res.send('Hello World!!!!');
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Queue App is running on http://localhost:' + port);
});