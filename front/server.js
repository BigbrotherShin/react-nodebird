const express = require('express');
const favicon = require('serve-favicon');
const next = require('next');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

const mode =
  process.env.NODE_ENV !== 'production' ||
  process.env.NODE_ENV === 'production';

dotenv.config();

const app = next({ mode });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(favicon(path.join(__dirname, 'public', 'favicon-16x16.png')));
  server.use(favicon(path.join(__dirname, 'public', 'favicon-32x32.png')));
  server.use(favicon(path.join(__dirname, 'public', 'favicon-96x96.png')));

  server.use(morgan('dev'));
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(cookieParser(process.env.COOKIE_SECRET));
  server.use(
    expressSession({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      cookie: {
        httpOnly: true,
        secure: false,
      },
    }),
  );

  server.get('/hashtag/:tag', (req, res) => {
    // '/hashtag' 페이지를 보여줌
    return app.render(req, res, '/hashtag', { tag: req.params.tag });
  });

  server.get('/user/:id', (req, res) => {
    return app.render(req, res, '/user', { id: req.params.id });
  });

  server.get('/profile/:id', (req, res) => {
    return app.render(req, res, '/profile', { id: req.params.id });
  });

  server.get('/post/:id', (req, res) => {
    return app.render(req, res, '/post', { id: req.params.id });
  });

  server.get('*', (req, res) => {
    // 모든 get 요청 처리
    return handle(req, res);
  });

  server.listen(3060, () => {
    console.log('next+expresss running on port 3060');
  });
});
