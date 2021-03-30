// var dotenvéronment
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRouters = require('./router/user.router');
const postRouters = require('./router/post.router');
// const expressJwt = require('express-jwt');
const app = express();

// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// use userRouter
app.use('/', userRouters);
app.use('/', postRouters);

// connected to database
const connection = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      useCreateIndex: true,
    });
    console.log('Connected to database');
  } catch (error) {
    console.log(Error);
  }
};

connection();

// port
const port = process.env.PORT;

// start server
app.listen(port, () => console.log(`server runnig at ${port}`));
