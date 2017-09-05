//
// Server for React app and WebHooks

import express from 'express';
import path from 'path';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import * as admin from "firebase-admin";

// use dotenv only in dev
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    privateKey: JSON.parse(process.env.PRIVATE_KEY),
    clientEmail: process.env.CLIENT_EMAIL,
  }),
  databaseURL: "https://queue-813f1.firebaseio.com",
});

// require for post
require('stripe')(process.env.STRIPE_API);

const app = express();

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views/`);

app.use('/static', express.static(path.resolve(`${__dirname}/../build/static`)));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
  const body = req.body;
  const twilio = require('twilio');
  const twiml = new twilio.twiml.MessagingResponse();
  console.log(body);
  if (body.Body.toLower() === 'cancel') {
    admin.database().ref('queuers/private/');
    twiml.message('You have cancelled your place in Queue. Thank you for using Queue!');
  } else {
    twiml.message('The Robots are coming! Head for the hills!');
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

app.listen(process.env.PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Queue is running on http://localhost:${process.env.PORT}`);
  } else {
    console.log(`Queue is running on https://www.queueup.site`);
  }
});
