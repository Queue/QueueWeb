//
// main file for app

import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import * as firebase from 'firebase';

let config = null;

if (typeof process.env.API_KEY === 'string') {
  config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
  };
} else {
  config = require('./lib/firebase-creds.js');
}

// init firebase
firebase.initializeApp(config);

// express config
const app = express();
app.set('view engine', 'pug');
app.set('views', `${__dirname}/templates`);

// front page
app.get('/', (req, res) => {
  res.render('front');
});

// queue page per user
app.get('/queue/:uid', async (req, res) => {
  try {
    const queuers = await firebase.database().ref(`queuers/${req.params.uid}`).once('value').then(snap => {
      console.log('loaded data')
      return snap.val();
    });
    res.render('queue', { queuers });
  } catch(error) {
    console.log(error.message);
  }
});

// serve
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Queue App is running on http://localhost:${port}`);
});
