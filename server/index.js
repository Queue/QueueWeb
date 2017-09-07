//
// Server for React app and WebHooks

import express from 'express';
import path from 'path';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import * as admin from 'firebase-admin';
import __ from './data.js';

// use dotenv only in dev
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// init firebase-admin sdk
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    privateKey: process.env.NODE_ENV === 'production' ? JSON.parse(process.env.PRIVATE_KEY) : process.env.PRIVATE_KEY, // weird heroku quirk
    clientEmail: process.env.CLIENT_EMAIL,
  }),
  databaseURL: "https://queue-813f1.firebaseio.com",
});

// require for post
require('stripe')(process.env.STRIPE_API);

// create the app
const app = express();

// set some shit
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views/`);

// use some shit
app.use('/static', express.static(path.resolve(`${__dirname}/../build/static`)));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// home route
app.get('/', (req, res) => {

  // @TODO use this for fnding queuers by phone number and then cancelling them.
  // iterate over all queuers - this will not scale well in the future - may need elasticsearch if it get busy
  admin.database().ref('queuers/private').once('value').then(snap => {
    const data = snap.val();
    const queuerKeys = __.getParentsOfPhonenumber(data, '+12174939781');

    // get specific entry
    if (queuerKeys) {

     admin.database().ref(`queuers/private/${queuerKeys.parent}/${queuerKeys.child}`).once('value').then(queuer => {
        const queuerData = queuer.val();
        res.send(queuerData);
      }).catch(error => {
        console.log(error);
      });

    } else {

      res.send('somthin');
      console.log('Queuer Keys are Fucked');

    }

  }).catch(error => {
    console.log(error);
  });

});

// send over the react app only with this route
app.get('/queue/:uid*', (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../build/index.html`));
});

// must be exact
app.get('/queue', (req, res) => {
  res.send('ACCESS DENIED');
});

// all stripe events
app.post('/stripe/events', (req, res) => {
  const events = req.body;
  console.log(events);
  res.send(200);
});

// all twilio events
app.post('/twiml/events', (req, res) => {
  const body = req.body;
  const twilio = require('twilio');
  const twiml = new twilio.twiml.MessagingResponse();
  console.log(body);
  if (body.Body.toLowerCase() === 'cancel') {
    twiml.message('You have cancelled your place in Queue. Thank you for using Queue!');
  } else {
    twiml.message('The Robots are coming! Head for the hills!');
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

// listen and serve (...your master!)
app.listen(process.env.PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Queue is running on http://localhost:${process.env.PORT}`);
  } else {
    console.log(`Queue is running on https://www.queueup.site`);
  }
});
