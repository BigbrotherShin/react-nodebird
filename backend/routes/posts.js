const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {
  // GET /api/posts
  try {
    const posts = await db.Post.findAll({
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
          through: 'Like', // DB 테이블 명
          as: 'Likers', // 프론트에 전달할 객체의 key
          attributes: ['id'],
        },
        {
          model: db.Post,
          as: 'Retweet',
          include: [
            {
              model: db.User,
              attributes: ['id', 'nickname'],
            },
            {
              model: db.Image,
            },
          ],
        },
      ],
      order: [
        // Will escape title and validate DESC against a list of valid direction parameters
        ['createdAt', 'DESC'], // DESC는 내림차순, ASC는 오름차순(default)
      ],
    });
    // console.log('POSTS: ', posts);
    return res.status(200).json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
