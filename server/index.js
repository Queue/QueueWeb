//
// Server for React app and WebHooks

import express from 'express';
import path from 'path';
import helmet from 'helmet';

const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

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

console.log(ip.address());

const app = express();

app.use('/static', express.static(path.resolve(`${__dirname}/../build/static`)));

app.use(helmet());

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

app.post('/creds', (req, res) => {
  res.send(JSON.stringify(config));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Queue App is running on http://localhost:${port}`);
});
