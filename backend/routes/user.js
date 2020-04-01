const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
  // /api/user
  // const user = Object.assign({}, req.user.toJSON());
  // delete user.password;

  return res.status(200).json(req.user); // passport.deserializeUser를 통한 req.user 데이터
});
router.post('/', async (req, res, next) => {
  // POST /api/user 회원가입
  try {
    const exUser = await db.User.findOne({
      where: {
        userId: req.body.userId,
      },
    });
    if (exUser) {
      return res.status(403).send('이미 사용중인 아이디입니다.');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12); // salt(2번째 인자)는 10~13 사이로
    const newUser = await db.User.create({
      nickname: req.body.nickname,
      userId: req.body.userId,
      password: hashedPassword,
    });
    // console.log(newUser);
    return res.status(200).json(newUser);
  } catch (e) {
    console.error(e);
    // 에러 처리를 여기서
    return next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const userInfo = await db.User.findOne({
      where: { id: parseInt(req.params.id, 10) },
      attributes: ['id', 'nickname'],
      include: [
        {
          model: db.Post,
          as: 'Posts',
          attributes: ['id'],
        },
        {
          model: db.User,
          as: 'Followers',
          attributes: ['id'],
        },
        {
          model: db.User,
          as: 'Followings',
          attributes: ['id'],
        },
      ],
    });
    const jsonUser = userInfo.toJSON(); // DB의 id를 지우기 위해 데이터 변경
    jsonUser.Posts = jsonUser.Posts ? jsonUser.Posts.length : 0;
    jsonUser.Followers = jsonUser.Followers ? jsonUser.Followers.length : 0;
    jsonUser.Followings = jsonUser.Followings ? jsonUser.Followings.length : 0;
    // console.log('JSON USER: ', jsonUser);
    res.status(200).json(jsonUser);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/:id/posts', async (req, res, next) => {
  // GET /api/user/:id/posts
  try {
    // console.log('REQ!!!: ', req.body);
    const userPosts = await db.Post.findAll({
      where: { userId: parseInt(req.params.id, 10), RetweetId: null },
      include: [
        {
          model: db.User,
          attributes: ['id', 'nickname'],
        },
        {
          model: db.Image,
        },
        {
          model: db.User,
          through: 'Like',
          as: 'Likers',
          attributes: ['id'],
        },
      ],
    });

    // console.log('!!!user posts!!!: ', userPosts);
    return res.status(200).json(userPosts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/logout', (req, res) => {
  // /api/user/logout
  req.logout();
  req.session.destroy();
  res.status(200).send('로그아웃 성공');
});

router.post('/login', (req, res, next) => {
  // POST /api/user/login
  passport.authenticate('local', (err, user, info) => {
    // (err, user, info) 는 passport의 done(err, data, logicErr) 세 가지 인자
    if (err) {
      // 서버에 에러가 있는 경우
      console.error(err);
      next(err);
    }
    if (info) {
      // 로직 상 에러가 있는 경우
      return res.status(401).send(info.reason);
    }
    return req.login(user, async loginErr => {
      try {
        if (loginErr) {
          return next(loginErr);
        }
        const fullUser = await db.User.findOne({
          where: { id: user.id },
          include: [
            {
              model: db.Post,
              as: 'Posts', // modeld의 as와 이름이 같게
              attributes: ['id'],
            },
            {
              model: db.User,
              as: 'Followers',
              attributes: ['id'],
            },
            {
              model: db.User,
              as: 'Followings',
              attributes: ['id'],
            },
          ],
          attributes: ['id', 'nickname', 'userId'],
        });

        // const filteredUser = Object.assign({}, user.toJSON());
        // user 객체는 sequelize 객체이기 때문에 순수한 JSON으로 만들기 위해 user.toJSON()
        // user.toJSON() 하지 않으면 에러 발생
        // delete filteredUser.password;
        // console.log(fullUser);
        return res.status(200).json(fullUser); // 프론트에서 result.data로 조회 가능
      } catch (e) {
        next(e);
      }
    });
  })(req, res, next);
});
router.get('/:id/follow', (req, res) => {});
router.post('/:id/follow', (req, res) => {});
router.delete('/:id/follow', (req, res) => {});
router.delete('/:id/follower', (req, res) => {});

module.exports = router;
