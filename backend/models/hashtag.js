module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define(
    'Hashtag',
    {
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      charset: 'utf8mb4',
      allocate: 'utf8mb4_general_ci',
    },
  );

  Hashtag.associate = db => {
    // through 를 통해 관계 테이블 생성
    db.Hashtag.belongsToMay(db.Post, { through: 'PostHashtag' }); // m:n 관계, Post 하나에 Hashtag가 여러개, Hashtag 하나에 Post가 여러개
  };

  return Hashtag;
};
