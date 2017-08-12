//
// Server for React app and WebHooks

import express from 'express';
import path from 'path';
import helmet from 'helmet';

let config = null;

if (typeof process.env.API_KEY === 'string') {
  config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
  };
} else {
  config = require('../src/firebase-creds.js');
}

const app = express();

app.use('/static', express.static(path.resolve(`${__dirname}/../build/static`)));

//app.use(helmet());

app.get('/', (req, res) => {
  res.send('Home');
});

app.get('/queue/:uid*', (req, res) => {
  res.sendFile(
    'index.html',
    { root: path.resolve(`${__dirname}/../build/`) }
  );
});

app.get('/queue', (req, res) => {
  res.send('ACCESS DENIED');
});

app.get('/creds', (req, res) => {
  // restrict to localhost only
  if (req.ip === '127.0.0.1' || req.ip === '::1') {
    res.send(JSON.stringify(config));
  } else {
    res.send('ACCESS DENIED');
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Queue App is running on http://localhost:${port}`);
});
