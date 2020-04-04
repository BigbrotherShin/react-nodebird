const db = require('../models');

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    // express에서 제공하는 함수
    next();
  } else {
    res.status(401).send('로그인이 필요합니다.');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // express에서 제공하는 함수
    next();
  } else {
    res.status(401).send('로그인한 사용자는 접근할 수 없습니다.');
  }
};

exports.findPost = async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: {
        id: parseInt(req.params.id, 10),
      },
      include: [
        {
          model: db.Post,
          as: 'Retweet',
        },
      ],
    });
    if (!post) {
      return res.status(404).send('포스트를 찾지 못했습니다.');
    }
    req.findPost = post;
    next();
  } catch (e) {
    console.error(e);
    next(e);
  }
};

exports.findUser = async (req, res, next) => {
  try {
    const findUser = await db.User.findOne({
      where: {
        id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
      },
      attributes: ['id', 'nickname'],
    });
    if (!findUser) {
      res.status(403).send('해당 유저를 찾을 수 없습니다.');
    }
    req.findUser = findUser;
    next();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
