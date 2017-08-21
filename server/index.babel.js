'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (process.env.NODE_ENV !== 'production') require('dotenv').config(); //
// Server for React app and WebHooks

require('stripe')(process.env.STRIPE_API);

var app = (0, _express2.default)();

app.use('/static', _express2.default.static(_path2.default.resolve(__dirname + '/../build/static')));

app.set('view engine', 'pug');
app.set('views', __dirname + '/views/');

app.use((0, _helmet2.default)());

app.get('/', function (req, res) {
  res.send('Home');
});

app.get('/queue/:uid*', function (req, res) {
  res.sendFile(_path2.default.resolve(__dirname + '/../build/index.html'));
});

// must be exact
app.get('/queue', function (req, res) {
  res.send('ACCESS DENIED');
});

app.post('/stripe/events', function (req, res) {
  var events = JSON.parse(req.body);
  console.log(events);
});

var port = process.env.PORT;

app.listen(port, function () {
  console.log('Queue App is running on http://localhost:' + port);
});
