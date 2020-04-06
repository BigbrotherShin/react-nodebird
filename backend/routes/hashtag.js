const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/:tag', async (req, res, next) => {
  // POST /api/posts/hashtag/:tag
  let where = {};
  if (parseInt(req.query.lastId, 10)) {
    where = {
      id: { [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10) },
    };
  }
  try {
    // console.log('REQ!!!: ', req.body);
    // console.log('PARAMS!!!!!: ', req.params);
    const hashtagPosts = await db.Post.findAll({
      where,
      include: [
        {
          model: db.Hashtag,
          where: { name: decodeURIComponent(req.params.tag) },
        },
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
      orders: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit, 10),
    });

    // console.log('!!!hashtag posts!!!: ', hashtagPosts);
    return res.status(200).json(hashtagPosts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
