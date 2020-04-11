import React, { useCallback } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { UNFOLLOW_USER_REQUEST, FOLLOW_USER_REQUEST } from '../reducers/user';

const FollowButton = ({ me, post }) => {
  const dispatch = useDispatch();

  const onUnfollow = useCallback(
    (userId) => () => {
      dispatch({
        type: UNFOLLOW_USER_REQUEST,
        data: userId,
      });
    },
    [],
  );
  const onFollow = useCallback(
    (userId) => () => {
      dispatch({
        type: FOLLOW_USER_REQUEST,
        data: userId,
      });
    },
    [],
  );

  return !me || post.User.id === me.id ? null : me.Followings &&
    me.Followings.find((v) => v.id === post.UserId) ? (
    <Button type='dashed' onClick={onUnfollow(post.User.id)}>
      언팔로우
    </Button>
  ) : (
    <Button onClick={onFollow(post.User.id)}>팔로우</Button>
  );
};

FollowButton.propTypes = {
  me: PropTypes.object,
  post: PropTypes.object.isRequired,
};

FollowButton.defaultProps = {
  me: null,
};

export default FollowButton;
