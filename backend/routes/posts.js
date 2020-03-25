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
          model: db.Comment,
          include: [
            {
              model: db.User,
              attributes: ['id', 'nickname'],
            },
          ],
          attributes: ['id', 'content'],
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

router.post('/hashtag/:tag', async (req, res, next) => {
  // POST /api/posts/hashtag/:tag
  try {
    // console.log('REQ!!!: ', req.body);
    // console.log('PARAMS!!!!!: ', req.params);
    const hashtag = await db.Hashtag.findOne({
      where: { name: req.params.tag },
    });
    // console.log('HASHTAG!!!: ', hashtag);
    const hashtagPosts = await hashtag.getPosts({
      include: [
        {
          model: db.Comment,
          include: [
            {
              model: db.User,
              attributes: ['id', 'nickname'],
            },
          ],
        },
        {
          model: db.User,
          attributes: ['id', 'nickname'],
        },
      ],
    });
    // console.log('!!!hashtag posts!!!: ', hashtagPosts);
    return res.status(200).json(hashtagPosts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/user/:id', async (req, res, next) => {
  // POST /api/posts/user/:id
  try {
    // console.log('REQ!!!: ', req.body);
    const user = await db.User.findOne({
      where: { id: req.body.id },
    });
    // console.log('USER!!!: ', user);
    const userPosts = await user.getPosts({
      include: [
        {
          model: db.Comment,
          include: [
            {
              model: db.User,
              attributes: ['id', 'nickname'],
            },
          ],
        },
        {
          model: db.User,
          attributes: ['id', 'nickname'],
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

module.exports = router;
