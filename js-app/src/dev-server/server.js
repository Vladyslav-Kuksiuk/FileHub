import express from 'express';

const app = express();
const port = 3001;

app.post('/login', (req, res) => {
  res.status(400);
  res.send({token: 'testToken'});
});

app.post('/register', (req, res) => {
  res.status(422);
  res.send({
    errors: [
      {fieldName: 'email', errorText: 'EmailError'},
      {fieldName: 'password', errorText: 'PasswordError'},
    ],
  });
});

app.listen(port);
