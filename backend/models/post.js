module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      content: {
        type: DataTypes.TEXT, // 매우 긴 글은 TEXT로
        allowNull: false,
      },
    },
    {
      charset: 'utf8mb4', // 한글 + 이모티콘
      collate: 'utf8mb4_general_ci',
    },
  );

  Post.associate = db => {
    db.Post.belongsTo(db.User); // belongsTo가 있는 테이블에 다른 테이블의 id를 저장(Post 테이블에 UserId 저장)
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsTo(db.Post, { as: 'Retweet' }); // Retweet관계
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); // 게시글에 like
  };

  return Post;
};
