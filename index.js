const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const port = 8900;

app.use(express.static('./uploads'));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

//Multer package
let storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads/files');
  },
  filename: (req, file, callback) => {
    callback(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    );
  },
});

let maxSize = 10 * 1000 * 1000;
let upload = multer({
  storage: storage,
  limits: {fileSize: maxSize},
});

let uploadHandle = upload.single('file');

app.get('/', (req, res) => {
  res.send('Hi Vetrivel Your Created a File upload Module !');
});

app.post('/upload', (req, res) => {
  uploadHandle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code == 'LIMIT_FILE_SIZE') {
        res.status(400).json({ message: 'Max file size is 10mb.' });
      }
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: 'No file!' });
    } else {
      res.status(200).json({ message: 'Uploaded to the Server!' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
