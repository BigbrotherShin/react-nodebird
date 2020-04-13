const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const path = require('path');
const hpp = require('hpp');
const helmet = require('helmet');

const prod = process.env.NODE_ENV === 'production';

const passportConfig = require('./passport');
const db = require('./models');
const userAPIRouter = require('./routes/user');
const postsAPIRouter = require('./routes/posts');
const postAPIRouter = require('./routes/post');
const hashtagAPIRouter = require('./routes/hashtag');

dotenv.config();
const app = express();
db.sequelize.sync();
passportConfig();

if (prod) {
  app.use(hpp());
  app.use(helmet());
  app.use(morgan('combined'));
  app.use(
    cors({
      origin: 'http://bigbroshin.net', // 요청 주소와 같게
      credentials: true, // cors, axios에서 둘 다 true로
    }),
  );
} else {
  app.use(morgan('dev'));
  app.use(
    cors({
      origin: true, // 요청 주소와 같게
      credentials: true, // cors, axios에서 둘 다 true로
    }),
  );
}

app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET)); // cookie 암호화 키. dotenv 라이브러리로 감춤
app.use(
  expressSession({
    resave: false, // 매번 session 강제 저장
    saveUninitialized: false, // 빈 값도 저장
    secret: process.env.COOKIE_SECRET, // cookie 암호화 키. dotenv 라이브러리로 감춤
    cookie: {
      httpOnly: true, // javascript로 cookie에 접근하지 못하게 하는 옵션
      secure: false, // https 프로토콜만 허락하는 지 여부
      domain: prod && '.bigbroshin.net',
    },
    name: 'rnbshj', //cookie 이름
  }),
);
app.use(passport.initialize());
app.use(passport.session()); // expressSession 모듈 아래에 코드를 작성해야 한다. 미들웨어 간에 서로 의존관계가 있는 경우 순서가 중요

// API는 다른 서비스가 내 서비스의 기능을 실행할 수 있게 열어둔 창구
app.use('/api/user', userAPIRouter);
app.use('/api/posts', postsAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/hashtag', hashtagAPIRouter);

app.get('/', (req, res) => {
  res.send('BigbroShin SNS backend 정상동작');
});

app.listen(prod ? process.env.PORT : 3065, () => {
  console.log(`server is running on ${process.env.PORT}`);
});
