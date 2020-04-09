import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { LOAD_USER_POSTS_REQUEST, UNLOAD_MAINPOSTS } from '../reducers/post';
import PostCard from '../containers/PostCard';
import { Card, Avatar } from 'antd';
import { LOAD_USER_REQUEST } from '../reducers/user';

const User = ({ id }) => {
  const { mainPosts, hasMorePost } = useSelector((state) => state.post);
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onScroll = () => {
    if (
      window.scrollY + document.documentElement.clientHeight >
      document.documentElement.scrollHeight - 300
    ) {
      if (mainPosts.length && hasMorePost) {
        dispatch({
          type: LOAD_USER_POSTS_REQUEST,
          data: id,
          lastId: mainPosts[mainPosts.length - 1].id,
        });
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts.length]);

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
      {mainPosts.map((c) => (
        <PostCard key={+c.createdAt} post={c} />
      ))}
    </div>
  );
};

User.propTypes = {
  id: PropTypes.number.isRequired,
};

User.getInitialProps = async (context) => {
  // console.log('User getInitialProps: ', context.query.id);
  const dispatch = context.store.dispatch;
  const gotPosts = context.store.getState().post.gotPosts;
  if (gotPosts) {
    dispatch({
      type: UNLOAD_MAINPOSTS,
    });
  }
  const id = parseInt(context.query.id, 10);
  context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: id,
  });
  return { id };
};

export default User;
