import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/PostCard';
import { Card, Avatar } from 'antd';
import { LOAD_USER_REQUEST } from '../reducers/user';

const User = () => {
  const { mainPosts } = useSelector(state => state.post);
  const { userInfo } = useSelector(state => state.user);

  return (
    <div>
      {userInfo ? (
        <Card
          actions={[
            <div key='twit'>
              쨱쨱
              <br />
              {userInfo.Posts}
            </div>,
            <div key='following'>
              팔로잉
              <br />
              {userInfo.Followings}
            </div>,
            <div key='follower'>
              팔로워
              <br />
              {userInfo.Followers}
            </div>,
          ]}
        >
          <Card.Meta
            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
            title={userInfo.nickname}
          />
        </Card>
      ) : null}
      {mainPosts.map(c => (
        <PostCard key={+c.createdAt} post={c} />
      ))}
    </div>
  );
};

User.propTypes = {
  id: PropTypes.number.isRequired,
};

User.getInitialProps = async context => {
  // console.log('User getInitialProps: ', context.query.id);
  const id = parseInt(context.query.id, 10);
  context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: id,
  });
  return { id };
};

export default User;
