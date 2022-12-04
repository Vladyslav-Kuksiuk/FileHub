import express from 'express';
import formidable from 'formidable';

const app = express();
const port = 3001;
let counterValue = 0;
const counter = () => {
  return counterValue++;
};

const convertType = (mimetype) => {
  mimetype = mimetype.toString();
  const types = {
    'application/pdf': 'PDF Document',
    'image/png': 'PNG Image',
    'image/jpeg': 'JPEG Image',
    'audio/mpeg': 'MP3 Audio',
  };
  return types[mimetype] ?? mimetype;
};

const convertSize = (size) => {
  if (size < 1023) {
    return size+' B';
  }

  if (size < 1048575) {
    return (size/1024).toFixed(1) +' KB';
  }

  if (size < 1073741823) {
    return (size/1048576).toFixed(1) +' MB';
  }

  if (size < 1099511627776) {
    return (size/1073741824).toFixed(1) +' GB';
  }
};


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
      id: 'testUser-file-'+counter(),

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
      id: 'testUser-file-'+counter(),
    },
    {
      name: 'MyFavouriteText.pdf',
      type: 'PDF Document',
      size: '13 KB',
      id: 'testUser-file-'+counter(),
    },
  ],
  'testUser-2': [
    {
      name: 'SecondFolder',
      id: 'testUser-2',
      parentId: 'testUser-1',
      itemsAmount: 1,
    },
  ],
};

app.use(express.json());
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
          type: convertType(file.mimetype),
          size: convertSize(file.size),
          id: 'testUser-file-'+counter(),
        });
      });
    });
    res.status(200);
    res.send({});
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
