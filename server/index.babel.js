'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
// Server for React app and WebHooks

var app = (0, _express2.default)();

app.use('/static', _express2.default.static(_path2.default.resolve(__dirname + '/../build/static')));

app.get('/', function (req, res) {
  res.send('Home');
});

app.get('/queue/:uid*', function (req, res) {
  res.sendFile('index.html', { root: _path2.default.resolve(__dirname + '/../build/') });
});

app.get('/queue', function (req, res) {
  res.send('ACCESS DENIED');
});

var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Queue App is running on http://localhost:' + port);
});
