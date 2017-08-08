'use strict';

require('babel-polyfill');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _firebase = require('firebase');

var firebase = _interopRequireWildcard(_firebase);

var _firebaseCreds = require('./lib/firebase-creds');

var _firebaseCreds2 = _interopRequireDefault(_firebaseCreds);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } //
// main file for app

// init firebase
firebase.initializeApp(_firebaseCreds2.default);

// create express app
var app = (0, _express2.default)();

app.set('view engine', 'pug');
app.set('views', __dirname + '/templates');

// homepage
app.get('/', function (req, res) {
  res.send('Home page');
});

// queue
app.get('/queue/:uid', function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res) {
    var queuers;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return firebase.database().ref('queuers/' + req.params.uid).once('value').then(function (snap) {
              return snap.val();
            });

          case 3:
            queuers = _context.sent;

            res.render('queue', { queuers: queuers });
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](0);

            console.log(_context.t0.message);

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 7]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

// serve
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Queue App is running on http://localhost:' + port);
});