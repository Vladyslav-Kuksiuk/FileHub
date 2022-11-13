import express from 'express';

const app = express();
const port = 3001;

const ROOT_FOLDER_ID = 'testUser-0';

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
    res.send({
      userProfile: {
        username: 'testUser',
        rootFolderId: ROOT_FOLDER_ID,
      },
    });
  }, 1000);
});

app.get('/folders/'+ROOT_FOLDER_ID, (req, res) => {
  setTimeout(() => {
    res.status(200);
    res.send({
      folderInfo: {
        name: 'testUserRoot',
        id: ROOT_FOLDER_ID,
        itemsAmount: 1,
        parentId: null,
      },
    });
  }, 500);
});

app.get('/logout', (req, res) => {
  res.status(200);
  res.send({});
});

app.listen(port, ()=>{
  // eslint-disable-next-line no-console
  console.log(`Listening port: ${port}`);
});
