//
// main file for app

import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import * as firebase from 'firebase';
import config from './lib/firebase-creds';

// init firebase
firebase.initializeApp(config);

// create express app
const app = express();

app.set('view engine', 'pug');
app.set('views', `${__dirname}/templates`);

// homepage
app.get('/', (req, res) => {
  res.send('Home page');
});

// queue
app.get('/queue/:uid', async (req, res) => {
  try {
    const queuers = await firebase.database().ref(`queuers/${req.params.uid}`).once('value').then(snap => {
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
