module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      content: {
        type: DataTypes.TEXT, // 긴 글
        allownull: false,
      },
    },
    {
      charset: 'utf8mb4', // 한글 + 이모티콘
      allocate: 'utf8mb4_general_ci',
    },
  );

  Comment.associate = db => {
    db.Comment.belongsTo(db.User); // User에 속해있음. Comment 테이블에 UserId 저장
    db.Comment.belongsTo(db.Post); // Post에 속해있음. Comment 테이블에 PostId 저장
  };

  return Comment;
};
