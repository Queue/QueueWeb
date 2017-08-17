//
// Server for React app and WebHooks

import express from 'express';
import path from 'path';
import helmet from 'helmet';

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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Queue App is running on http://localhost:${port}`);
});
