const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../models');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'userId',
        passwordField: 'password',
      },
      async (userId, password, done) => {
        try {
          const user = await db.User.findOne({ where: { userId } });
          if (!user) {
            // 유저가 있는지 확인
            return done(null, false, { reason: '존재하지 않는 사용자입니다.' });
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            // 유저가 있다면 비밀번호 확인
            return done(null, user);
          }
          return done(null, false, { reason: '비밀번호가 틀립니다.' }); // 비밀번호 틀렸을 때
        } catch (e) {
          console.error(e);
          return done(e);
        }
      },
    ),
  );
};
