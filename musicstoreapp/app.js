var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept, token");
  // Debemos especificar todas las headers que se aceptan. Content-Type , token
  next();
});
let jwt = require('jsonwebtoken');
app.set('jwt', jwt);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let expressSession = require('express-session');
app.use(expressSession({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: true
}));

let crypto = require('crypto');
let fileUpload = require('express-fileupload');
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  createParentPath: true
}));

app.set('uploadPath', __dirname);
app.set('clave','abcdefg');
app.set('crypto',crypto);

const { MongoClient } = require("mongodb");
const connectionStrings = 'mongodb+srv://admin:sdi@musicstoreapp.vuwi6mf.mongodb.net/?appName=musicstoreapp';
const dbClient = new MongoClient(connectionStrings);

let songsRepository = require("./repositories/songsRepository.js");
songsRepository.init(app, dbClient);
const usersRepository = require("./repositories/usersRepository.js");
usersRepository.init(app, dbClient);
const favoritesRepository = require("./repositories/favoriteSongsRepository.js");
favoritesRepository.init(app, dbClient);
const commentsRepository = require("./repositories/commentsRepository.js");
commentsRepository.init(app, dbClient);

const userSessionRouter = require('./routes/userSessionRouter');
const userAuthorRouter = require('./routes/userAuthorRouter');
const userTokenRouter = require('./routes/userTokenRouter');
const userAudiosRouter = require('./routes/userAudiosRouter');

app.use("/api/v1.0/songs/", userTokenRouter);

app.use("/songs/edit", userAuthorRouter);
app.use("/songs/delete", userAuthorRouter);
app.use("/songs/add", userSessionRouter);
app.use("/publications", userSessionRouter);
app.use("/songs/buy", userSessionRouter);
app.use("/purchases", userSessionRouter);
app.use("/audios/", userAudiosRouter);
app.use("/shop/", userSessionRouter);
app.use("/songs/favorites", userSessionRouter);

require("./routes/api/songsAPIv1.0.js")(app, songsRepository, usersRepository);
require("./routes/users.js")(app, usersRepository);
require("./routes/songs/favorites.js")(app, favoritesRepository);
require("./routes/comments.js")(app, commentsRepository);
require("./routes/songs.js")(app, songsRepository, commentsRepository);
require("./routes/authors.js")(app);

var indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  console.log("Se ha producido un error" + err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  if (req.originalUrl.startsWith('/api/')) {
    res.json({ error: err.message });
  } else {
    res.render('error');
  }
});

module.exports = app;