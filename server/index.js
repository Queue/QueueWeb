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

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views/`);

app.use('/static', express.static(path.resolve(`${__dirname}/../build/static`)));
app.use(helmet());
app.use(bodyParser.json());

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
  const events = req.body;
  console.log(events);
  res.send(200);
});

app.post('/twiml/events', (req, res) => {
  const events = req.body;
  console.log(events);
  var twilio = require('twilio')('SK9c98f50183059bacd3ce562adc241d71');
  var twiml = new twilio.TwimlResponse();
  twiml.message('The Robots are coming! Head for the hills!');
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

app.listen(process.env.PORT, () => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`Queue is running on http://localhost:${process.env.PORT}`);
  } else {
    console.log(`Queue is running on https://www.queueup.site`);
  }
});
