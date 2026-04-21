const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rest = require('request');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const crypto = require('crypto');
const fileUpload = require('express-fileupload');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { MongoClient } = require("mongodb");
const { Song } = require('./schemas/song.schema');
let { SongRequest } = require('./schemas/songRequest.schema');

const app = express();

const connectionStrings = 'mongodb+srv://admin:sdi@musicstoreapp.vuwi6mf.mongodb.net/?appName=musicstoreapp';
const dbClient = new MongoClient(connectionStrings);

const songsRepository = require("./repositories/songsRepository.js");
songsRepository.init(app, dbClient);
const usersRepository = require("./repositories/usersRepository.js");
usersRepository.init(app, dbClient);
const favoritesRepository = require("./repositories/favoriteSongsRepository.js");
favoritesRepository.init(app, dbClient);
const commentsRepository = require("./repositories/commentsRepository.js");
commentsRepository.init(app, dbClient);

app.set('rest', rest);
app.set('jwt', jwt);
app.set('clave', 'abcdefg');
app.set('crypto', crypto);
app.set('uploadPath', __dirname);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
  next();
});
const cors = require('cors');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: true
}));

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  createParentPath: true
}));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de la tienda de música de SDI',
      version: '1.0.0',
      description: 'Documentación interactiva de la API',
    },
    components: {
      schemas: {
        Song,
        SongRequest
      }
    },
    servers: [
      {
        url: 'http://localhost:8081',
        description: 'Servidor de pruebas de la aplicación',
      },
    ],
  },
  apis: [path.join(__dirname, 'routes/api/*.js')],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  console.log("Se ha producido un error: " + err);
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