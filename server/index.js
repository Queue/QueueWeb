//
// Server for React app and WebHooks

import express from 'express';
import path from 'path';

const app = express();

app.use('/static', express.static(path.resolve(`${__dirname}/../build/static`)));

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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Queue App is running on http://localhost:${port}`);
});
