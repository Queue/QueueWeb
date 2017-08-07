import express from 'express';
import bodyParser from 'body-parser';
import reload from 'express-reload';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!!!!');
});

app.listen(3000, () => {
  console.log('Queue App is running on http://localhost:3000');
});
