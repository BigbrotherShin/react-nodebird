const express = require('express');
const db = require('../models');
const path = require('path');
const { isLoggedIn } = require('./middleware');
const multer = require('multer');
const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads'); // 저장할 디렉토리, 첫 번째 arg는 서버에러 있을 때
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext); // SJH.png, ext===.png, basename===SJH
      done(null, basename + new Date().valueOf() + ext);
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
        hashtags.map(tag =>
          db.Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() },
          }),
        ),
      );
      console.log(result);
      await newPost.addHashtags(result.map(r => r[0]));
    }

    if (Array.isArray(req.body.image)) {
      // 이미지 주소를 여러개 올리면 images: [주소1, 주소2] 그렇기 때문에 Array.isArray()로 배열인지 아닌지 확인
      const images = await Promise.all(
        req.body.image.map(image => {
          return db.Image.create({ src: image });
        }),
      );
      await newPost.addImages(images);
    } else {
      // 이미지를 하나만 올리면 image: 주소1
      const image = await db.Image.create({ src: req.body.image });
      await newPost.addImage(image);
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

router.get('/:id/comments', async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: parseInt(req.params.id, 10) },
    });
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
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

router.post('/:id/comment', isLoggedIn, async (req, res, next) => {
  // POST /api/post/:id/comment
  try {
    const post = await db.Post.findOne({
      where: { id: parseInt(req.params.id, 10) },
    });
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    const newComment = await db.Comment.create({
      PostId: post.id,
      UserId: req.user.id,
      content: req.body.content,
    });
    await post.addComment(newComment.id);
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

  res.json(req.files.map(v => v.filename));
});

module.exports = router;
