import express from 'express';
import {STATE, USER_PROFILE, FOLDER_INFO} from '../state-management/state.js';

const app = express();
const port = 3001;

const ROOT_FOLDER_ID = 'testUser-0';
const FIRS_INNER_FOLDER_ID = 'testUser-1';

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
      [STATE.USER_PROFILE]: {
        [USER_PROFILE.USERNAME]: 'testUser',
        [USER_PROFILE.ROOT_FOLDER_ID]: ROOT_FOLDER_ID,
      },
    });
  }, 1000);
});

app.get('/folder-info/'+ROOT_FOLDER_ID, (req, res) => {
  setTimeout(() => {
    res.status(200);
    res.send({
      [STATE.FOLDER_INFO]: {
        [FOLDER_INFO.NAME]: 'testUserRoot',
        [FOLDER_INFO.ID]: ROOT_FOLDER_ID,
        [FOLDER_INFO.ITEMS_AMOUNT]: 1,
        [FOLDER_INFO.PARENT_ID]: null,
      },
    });
  }, 500);
});

app.get('/folder-info/'+FIRS_INNER_FOLDER_ID, (req, res) => {
  setTimeout(() => {
    res.status(200);
    res.send({
      [STATE.FOLDER_INFO]: {
        [FOLDER_INFO.NAME]: 'FirstInnerFolder',
        [FOLDER_INFO.ID]: FIRS_INNER_FOLDER_ID,
        [FOLDER_INFO.ITEMS_AMOUNT]: 1,
        [FOLDER_INFO.PARENT_ID]: ROOT_FOLDER_ID,
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
