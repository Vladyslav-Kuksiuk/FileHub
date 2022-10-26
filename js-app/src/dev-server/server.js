import express from 'express';
const app = express();
const port = 3001;

app.post('/login', (req, res) => {
  res.send({token: 'From_dev_server'});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
