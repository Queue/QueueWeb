//
// Server for React app and WebHooks

import express from 'express';
import path from 'path';
import helmet from 'helmet';
import bodyParser from 'body-parser';

// use dotenv only in dev
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// require for post
require('stripe')(process.env.STRIPE_API);

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
  try {
    const events = bodyParser.json(req.body);
    console.log(events);
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT, () => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`Queue is running on http://localhost:${process.env.PORT}`);
  } else {
    console.log(`Queue is running on https://www.queueup.site`);
  }
});
