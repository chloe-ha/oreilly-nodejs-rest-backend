const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, res, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});
const fileFilter = (req, file, callback) => {
  if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

app.use(express.json());
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  const { statusCode = 500, message, data = [] } = err;
  res.status(statusCode).json({ message, data });
});

mongoose
  .connect('mongodb+srv://user:user@cluster0.psshf.mongodb.net/feed')
  .then(() => {
    console.log('# Connected to mongoDB');
    app.listen(8080);
  })
  .catch((err) => console.log(err));
