const passport = require('passport');
const db = require('../models');
const local = require('./local');

module.exports = () => {
  passport.serializeUser((user, done) => {
    // 서버쪽에 [{ id: 3, cookie: 'asvxzc' }], cookie는 프론트로 보냄
    return done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.User.findOne({
        // user 정보를 불러오고
        where: { id },
      });
      return done(null, user); // 불러온 user 정보는 req.user에 저장
    } catch (e) {
      console.error(e);
      return done(e);
    }
  });

  local();
};
