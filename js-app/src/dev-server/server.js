import express from 'express';
import formidable from 'formidable';

const app = express();
const port = 3001;
let counterValue = 0;
const counter = () => {
  return counterValue++;
};

let authToken = Math.random().toString();

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
      parentId: 'testUser-0',
    },
    {
      name: 'MyFavouriteTrack.mp3',
      type: 'file',
      mimetype: 'audio/mpeg',
      size: 1405091,
      id: 'testUser-file-'+counter(),
      parentId: 'testUser-0',
    },
  ],
  'testUser-1': [
    {
      name: 'SecondFolder',
      type: 'folder',
      id: 'testUser-2',
      parentId: 'testUser-1',
    },
    {
      name: 'MyFavouriteVideo.avi',
      type: 'file',
      mimetype: 'video/x-msvideo',
      size: 3650722201,
      id: 'testUser-file-'+counter(),
      parentId: 'testUser-1',
    },
    {
      name: 'MyFavouriteText.pdf',
      type: 'file',
      mimetype: 'application/pdf',
      size: 13312,
      id: 'testUser-file-'+counter(),
      parentId: 'testUser-1',
    },
  ],
  'testUser-2': [
    {
      name: 'SecondFolder',
      id: 'testUser-2',
      parentId: 'testUser-2',
      itemsAmount: 1,
    },
  ],
};

app.use(express.json());
app.post('/login', (req, res) => {
  res.status(200);
  res.send({token: authToken});
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
    if (req.headers.authorization.split(' ')[1] !== authToken) {
      res.status(401);
      res.send();
    }
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

app.delete('/file/:id', ((req, res) => {
  setTimeout(() => {
    Object.entries(foldersContent).forEach(([folderId, contentArray]) => {
      contentArray.forEach((file, index)=>{
        if (file.id === req.params.id) {
          foldersContent[folderId].splice(index, 1);
        }
      });
    });

    res.status(200);
    res.send({});
  }, 500);
}));

app.put('/file/:id', ((req, res) => {
  setTimeout(() => {
    Object.entries(foldersContent).forEach(([folderId, content]) => {
      content.forEach((item) => {
        if (item.id === req.params.id) {
          item.name = req.body.name;
        }
      });
    });
    res.status(200);
    res.send({});
  }, 1000);
}));

app.get('/files/:id', (req, res)=>{
  setTimeout(()=>{
    res.download('./src/dev-server/test.txt' );
    res.status(200);
  }, 500);
});

app.put('/folder/:id', ((req, res) => {
  setTimeout(() => {
    res.status(422);
    res.send({
      errors: [
        {fieldName: 'renameField', errorText: 'Why are you renaming me :('},
        {fieldName: 'renameField', errorText: 'Am I that bad?'},
      ],
    });
  }, 200);
}));

app.delete('/folder/:id', ((req, res) => {
  setTimeout(() => {
    res.status(404);
    res.send({});
  }, 1000);
}));

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

app.post('/folders/:folderId/content', (req, res) => {
  setTimeout(() => {
    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      Object.entries(files).forEach(([key, file])=>{
        foldersContent[req.params.folderId].push({
          name: file.originalFilename,
          type: 'file',
          mimetype: file.mimetype,
          size: file.size,
          id: 'testUser-file-'+counter(),
          parentId: req.params.folderId,
        });
      });
    });
    res.status(200);
    res.send({});
  }, 500);
});

app.post('/folders', (req, res) => {
  setTimeout(() => {
    const id = 'testUser-'+counter();
    const newFolder ={
      type: 'folder',
      name: req.body.name,
      id: id,
      parentId: req.body.parentId,
      itemsAmount: 0,
    };
    foldersInfo[id] = newFolder;

    Object.entries(foldersContent).forEach(([folderId, contentArray]) => {
      if (folderId === req.body.parentId) {
        contentArray.push(newFolder);
      }
    });
    foldersContent[id] = [];
    res.status(200);
    res.send({});
  }, 500);
});

app.post('/logout', (req, res) => {
  authToken = Math.random().toString();
  res.status(200);
  res.send({});
});

app.listen(port, ()=>{
  // eslint-disable-next-line no-console
  console.log(`Listening port: ${port}`);
});
