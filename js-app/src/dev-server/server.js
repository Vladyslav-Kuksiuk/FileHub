import express from 'express';

const app = express();
const port = 3001;

const foldersInfo = {
  'testUser-0': {
    name: 'Home',
    id: 'testUser-0',
    parentId: null,
    itemsAmount: 1,
  },
  'testUser-1': {
    name: 'FirstFolder',
    id: 'testUser-1',
    parentId: 'testUser-0',
    itemsAmount: 1,
  },
  'testUser-2': {
    name: 'SecondFolder',
    id: 'testUser-2',
    parentId: 'testUser-1',
    itemsAmount: 1,
  },
};

const foldersContent = {
  'testUser-0': [
    {
      name: 'FirstFolder',
      type: 'folder',
      id: 'testUser-1',
    },
    {
      name: 'MyFavouriteTrack.mp3',
      type: 'MP3 Audio',
      size: '1.34 MB',
      id: 'testUser-file-0',

    },
  ],
  'testUser-1': [
    {
      name: 'SecondFolder',
      type: 'folder',
      id: 'testUser-2',
    },
    {
      name: 'MyFavouriteVideo.avi',
      type: 'AVI Movie',
      size: '3.4 GB',
      id: 'testUser-file-1',
    },
    {
      name: 'MyFavouriteText.pdf',
      type: 'PDF Document',
      size: '13 KB',
      id: 'testUser-file-2',
    },
  ],
  'testUser-2': {
    name: 'SecondFolder',
    id: 'testUser-2',
    parentId: 'testUser-1',
    itemsAmount: 1,
  },
};

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
        rootFolderId: 'testUser-0',
      },
    });
  }, 1000);
});

app.get('/folders/:folderId', (req, res) => {
  setTimeout(() => {
    if (foldersInfo[req.params['folderId']]) {
      res.status(200);
      res.send({
        folderInfo: foldersInfo[req.params['folderId']],
      });
    } else {
      res.status(404);
      res.send({});
    }
  }, 500);
});

app.get('/folders/:folderId/content', (req, res) => {
  setTimeout(() => {
    if (foldersContent[req.params['folderId']]) {
      res.status(200);
      res.send({folderContent: foldersContent[req.params['folderId']]});
    } else {
      res.status(404);
      res.send({});
    }
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
