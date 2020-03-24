const passport = require('passport');
const db = require('../models');
const local = require('./local');

module.exports = () => {
  passport.serializeUser((user, done) => {
    // router의 req.login 요청이 들어오면 실행된다.
    // 역할: 서버 메모리를 아끼기 위해 많은 사용자 정보 중에서 필요한 부분만 메모리에 저장하도록함. (여기에서는 id)
    // 서버쪽에 [{ id: 3, cookie: 'asvxzc' }] 저장, cookie는 프론트로 보냄
    return done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.User.findOne({
        // 프론트에서 cookie를 보내면, 서버는 메모리에서 cookie와 관련된 id를 찾은 뒤 DB에서 user 정보를 불러옴.
        where: { id },
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
        attributes: ['id', 'nickname', 'userId'],
      });
      return done(null, user); // 불러온 user 정보는 req.user에 저장. route에서 req.user 사용 가능
    } catch (e) {
      console.error(e);
      return done(e);
    }
  });

  local();
};

// 프론트에서 서버로는 cookie만 보냄(asvxzc)
// 서버가 cookie-parser, express-session으로 쿠키 검사 후 id: 3 발견
// id:3 이 deserializeUser에 들어감
// DB에서 사용자 정보를 찾은 후, req.user로 사용자 정보가 들어감

// 프론트에서 요청보낼 때마다 deserializeUser가 실행됨(db 요청 1번씩 실행)
// 실무에서는 deserializeUser 결과물 캐싱
