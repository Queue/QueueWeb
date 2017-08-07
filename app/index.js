import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!!!!!!!!!');
});

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Queue App is running on http://localhost:${port}`);
});
