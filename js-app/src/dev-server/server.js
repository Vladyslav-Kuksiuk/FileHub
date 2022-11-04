import express from 'express';

const app = express();
const port = 3001;

app.post('/login', (req, res) => {
  res.status(200);
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

app.get('/user', (req, res) => {
  setTimeout(() => {
    res.status(200);
    res.send({username: 'test user name'});
  }, 1000);
});

app.get('/logout', (req, res) => {
  res.status(200);
  res.send({});
});

app.listen(port, ()=>{
  // eslint-disable-next-line no-console
  console.log(`Listening port: ${port}`);
});
