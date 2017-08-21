//
// Server for React app and WebHooks

import express from 'express';
import path from 'path';
import helmet from 'helmet';

// use dotenv only in dev
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// require for post
const stripe = require('stripe')(process.env.STRIPE_API);
//console.log(stripe);

const app = express();

app.use('/static', express.static(path.resolve(`${__dirname}/../build/static`)));

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views/`);

app.use(helmet());

app.get('/', (req, res) => {
  res.send('Home');
});

app.get('/queue/:uid*', (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../build/index.html`));
});

// must be exact
app.get('/queue', (req, res) => {
  res.send('ACCESS DENIED');
});

app.post('/stripe/events', (req, res) => {
  const events = JSON.parse(req.body);
  console.log(events);
});

app.listen(process.env.PORT, () => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`Queue is running on http://localhost:${process.env.PORT}`);
  } else {
    console.log(`Queue is running on https://www.queueup.site`);
  }
});
