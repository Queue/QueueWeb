'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _firebaseAdmin = require('firebase-admin');

var admin = _interopRequireWildcard(_firebaseAdmin);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// use dotenv only in dev
if (process.env.NODE_ENV !== 'production') require('dotenv').config(); //
// Server for React app and WebHooks

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    // strange heroku quirk for env
    privateKey: process.env.NODE_ENV === 'production' ? JSON.parse(process.env.PRIVATE_KEY) : process.env.PRIVATE_KEY,
    clientEmail: process.env.CLIENT_EMAIL
  }),
  databaseURL: "https://queue-813f1.firebaseio.com"
});

// require for post
require('stripe')(process.env.STRIPE_API);

var app = (0, _express2.default)();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views/');

app.use('/static', _express2.default.static(_path2.default.resolve(__dirname + '/../build/static')));
app.use((0, _helmet2.default)());
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));

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
  var events = req.body;
  console.log(events);
  res.send(200);
});

app.post('/twiml/events', function (req, res) {
  var body = req.body;
  var twilio = require('twilio');
  var twiml = new twilio.twiml.MessagingResponse();
  console.log(body);
  if (body.Body.toLower() === 'cancel') {
    admin.database().ref('queuers/private/');
    twiml.message('You have cancelled your place in Queue. Thank you for using Queue!');
  } else {
    twiml.message('The Robots are coming! Head for the hills!');
  }
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

app.listen(process.env.PORT, function () {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Queue is running on http://localhost:' + process.env.PORT);
  } else {
    console.log('Queue is running on https://www.queueup.site');
  }
});
