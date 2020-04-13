const express = require('express');
const path = require('path');
const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const db = require('../models');
const { isLoggedIn, findPost } = require('./middleware');
const router = express.Router();

AWS.config.update({
  region: 'ap-northeast-2',
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'bigbroshin',
    key(req, file, cb) {
      cb(null, `original/${+new Date()}${path.basename(file.originalname)}`);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB로 용량 제한. 큰 용량 허용할 때 해커 공격 가능
});

// multer: 폼데이터 파일 -> req.file(s) / 폼데이터 일반 값 -> req.body
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
  // POST /api/post
  try {
    const hashtags = req.body.content.match(/#[^\s]+/g); // 해시태그 뽑아내는 정규표현식
    const newPost = await db.Post.create({
      content: req.body.content, // ex> 게시글 #태그1 #태그2 #태그3
      UserId: req.user.id,
    });

    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          db.Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() },
          }),
        ),
      );
      console.log(result);
      await newPost.addHashtags(result.map((r) => r[0]));
    }

    if (Array.isArray(req.body.image)) {
      // 이미지 주소를 여러개 올리면 images: [주소1, 주소2] 그렇기 때문에 Array.isArray()로 배열인지 아닌지 확인
      const images = await Promise.all(
        req.body.image.map((image) => {
          return db.Image.create({ src: image });
        }),
      );
      await newPost.addImages(images);
    } else if (req.body.image) {
      // 이미지를 하나만 올리면 image: 주소1

      const image = await db.Image.create({ src: req.body.image });
      await newPost.addImage(image); // DB에서 image를 post와 연결
    }

    // const User = await newPost.getUser();
    // newPost.User = User;
    // res.json(newPost);
    const fullPost = await db.Post.findOne({
      // 둘 중에 한 가지 방식으로 하면 됨.
      where: { id: newPost.id },
      include: [
        {
          model: db.User,
          attributes: ['id', 'nickname'],
        },
        {
          model: db.Image,
        },
      ],
    });
    res.json(fullPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/:id/comments', findPost, async (req, res, next) => {
  try {
    const comments = await db.Comment.findAll({
      where: { PostId: parseInt(req.params.id, 10) },
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: db.User,
          attributes: ['id', 'nickname'],
        },
      ],
    });
    // console.log('LOADED COMMENTS: ', comments);
    res.json(comments);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/:id/comment', isLoggedIn, findPost, async (req, res, next) => {
  // POST /api/post/:id/comment
  try {
    const newComment = await db.Comment.create({
      PostId: req.findPost.id,
      UserId: req.user.id,
      content: req.body.content,
    });
    await req.findPost.addComment(newComment.id);
    const comment = await db.Comment.findOne({
      where: {
        id: newComment.id,
      },
      include: [
        {
          model: db.User,
          attributes: ['id', 'nickname'],
        },
      ],
    });
    return res.json(comment);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/images', upload.array('image'), (req, res) => {
  // multer: 폼데이터 파일 -> req.file(s) / 폼데이터 일반 값 -> req.body

  // upload.array() 이미지 여러 장 -> req.files
  // upload.single() 이미지 한 장 올릴 때 -> req.file
  // upload.none() 이미지나 파일을 안 올릴 때 -> req.body
  console.log(req.files);
  res.json(req.files.map((v) => v.location));
});

router.post('/:id/like', isLoggedIn, findPost, async (req, res, next) => {
  try {
    await req.findPost.addLiker(req.user.id);
    res.json({ userId: req.user.id, postId: parseInt(req.params.id, 10) });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete('/:id/like', isLoggedIn, findPost, async (req, res, next) => {
  try {
    await req.findPost.removeLiker(req.user.id);
    res.json({ userId: req.user.id, postId: parseInt(req.params.id, 10) });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/:id/retweet', isLoggedIn, findPost, async (req, res, next) => {
  try {
    if (
      req.user.id === req.findPost.UserId ||
      (req.findPost.Retweet && req.findPost.Retweet.UserId === req.user.id)
    ) {
      return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
    }
    const retweetTargetId = req.findPost.RetweetId || req.findPost.id;
    const exPost = await db.Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    if (exPost) {
      return res.status(403).send('이미 리트윗 했습니다.');
    }
    const retweet = await db.Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: 'content', // Post model이 content({ allowNull:false }) 이므로 임의로 content 넣어줌
    });
    const retweetWithPrevPost = await db.Post.findOne({
      where: {
        id: retweet.id,
      },
      include: [
        {
          model: db.User,
          attributes: ['id', 'nickname'],
        },
        {
          model: db.Image,
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
    });
    res.json(retweetWithPrevPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete('/:id/delete', isLoggedIn, findPost, async (req, res, next) => {
  try {
    if (req.findPost.UserId !== parseInt(req.user.id, 10)) {
      return res.status(403).send('글쓴이가 아닙니다.');
    }
    await db.Post.destroy({
      where: {
        RetweetId: parseInt(req.params.id, 10),
      },
    });
    await db.Post.destroy({
      where: {
        id: parseInt(req.params.id, 10),
      },
    });
    res.json({ postId: parseInt(req.params.id, 10) });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.patch('/:id/edit', isLoggedIn, findPost, async (req, res, next) => {
  try {
    if (req.findPost.UserId !== parseInt(req.user.id, 10)) {
      return res.status(403).send('글쓴이가 아닙니다.');
    }
    await db.Post.update(
      { content: req.body.editPostContent },
      {
        where: {
          id: parseInt(req.params.id, 10),
        },
      },
    );
    res.json({
      editPostContent: req.body.editPostContent,
      postId: parseInt(req.params.id, 10),
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: {
        id: parseInt(req.params.id, 10),
      },
      include: [
        {
          model: db.User,
          attributes: ['id', 'nickname'],
        },
        {
          model: db.User,
          as: 'Likers',
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
        },
        {
          model: db.Image,
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
    });
    console.log(post);

    res.json(post);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
