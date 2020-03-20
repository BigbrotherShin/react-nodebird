module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User', // 테이블명은 users 로 자동으로 바뀜
    {
      nickname: {
        type: DataTypes.STRING(20), // 20 글자 이하
        allowNull: false, // 필수
      },
      userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true, // 고유한 값
      },
      password: {
        type: DataTypes.STRING(100), // 100 글자 이하
        allowNull: false,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci', // 설정해줘야 한글이 저장됨
    },
  );

  User.associate = db => {
    db.User.hasMany(db.Post, { as: 'Posts' }); // as 를 통해 조합이 같은 테이블과 구별. 꼭 적어줘야함.
    //db.User.belongsToMany(db.Post, { through: 'Like' });과 구별
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' }); // belongsToMany 관계는 as를 달아주는 게 좋다.
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followers', // JS 객체에서 사용할 이름
      foreignKey: 'followingId', // DB 컬럼명: 반대로 쓰는 foreignKey가 남의 테이블 id를 가리키기 때문
    }); // 같은 테이블 끼리 다대다관계이면 구별을 위해 as로 구별
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followings',
      foreignKey: 'followerId',
    });
  };

  return User;
};
