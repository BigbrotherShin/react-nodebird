import React, { useCallback } from 'react';
import { Button, List } from 'antd';
import NicknameEditForm from '../containers/NicknameEditForm';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  REMOVE_FOLLOWER_REQUEST,
  UNFOLLOW_USER_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWERS_REQUEST,
  UNLOAD_FOLLOWERS,
  UNLOAD_FOLLOWINGS,
} from '../reducers/user';
import { LOAD_USER_POSTS_REQUEST, UNLOAD_MAINPOSTS } from '../reducers/post';
import PostCard from '../containers/PostCard';
import FollowList from '../components/FollowList';

const Profile = ({ id }) => {
  const dispatch = useDispatch();
  const { mainPosts, hasMorePost } = useSelector((state) => state.post);
  const {
    me,
    followingList,
    followerList,
    hasMoreFollowings,
    hasMoreFollowers,
  } = useSelector((state) => state.user);

  const onFollowerDelete = useCallback(
    (id) => () => {
      dispatch({
        type: REMOVE_FOLLOWER_REQUEST,
        data: id,
      });
    },
    [],
  );

  const onFollowingDelete = useCallback(
    (id) => () => {
      dispatch({
        type: UNFOLLOW_USER_REQUEST,
        data: id,
      });
    },
    [],
  );

  const loadMoreFollowings = useCallback(() => {
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
      data: id,
      offset: followingList.length,
    });
  }, [followingList.length]);

  const loadMoreFollowers = useCallback(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
      data: id,
      offset: followerList.length,
    });
  }, [followerList.length]);

  const loadMoreUserPosts = useCallback(() => {
    dispatch({
      type: LOAD_USER_POSTS_REQUEST,
      data: id,
      lastId:
        mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id,
    });
  }, [mainPosts.length]);

  return me ? (
    <div>
      <NicknameEditForm />
      <FollowList
        header='팔로워'
        hasMore={hasMoreFollowers}
        loadMore={loadMoreFollowers}
        data={followerList}
        unFollow={onFollowerDelete}
      />
      <FollowList
        header='팔로잉'
        hasMore={hasMoreFollowings}
        loadMore={loadMoreFollowings}
        data={followingList}
        unFollow={onFollowingDelete}
      />
      <List
        style={{ marginBottom: '20px' }}
        header={<div>게시물</div>}
        loadMore={
          hasMorePost ? (
            <Button style={{ width: '100%' }} onClick={loadMoreUserPosts}>
              더 보기
            </Button>
          ) : null
        }
        bordered
        dataSource={mainPosts}
        renderItem={(item) => {
          return <PostCard key={item.id} post={item} />;
        }}
      />
    </div>
  ) : (
    <div>로그인이 되어있지 않습니다.</div>
  );
};

Profile.propTypes = {
  id: PropTypes.number.isRequired,
};

Profile.getInitialProps = async (context) => {
  // 이 직전에 LOAD_USER_REQUEST -> 이 요청이 끝나야 user.me가 생성됨
  const state = context.store.getState();
  if (state.post.gotPosts) {
    context.store.dispatch({
      type: UNLOAD_MAINPOSTS,
    });
  }
  if (state.user.gotFollowings) {
    context.store.dispatch({
      type: UNLOAD_FOLLOWERS,
    });
  }
  if (state.user.gotFollowers) {
    context.store.dispatch({
      type: UNLOAD_FOLLOWINGS,
    });
  }
  context.store.dispatch({
    type: LOAD_FOLLOWINGS_REQUEST,
    data: context.query.id,
  });
  context.store.dispatch({
    type: LOAD_FOLLOWERS_REQUEST,
    data: context.query.id,
  });
  context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: context.query.id,
  });
  // 아직까지는 context.query.id === null;
  // 이 쯤에서 LOAD_USER_SUCCESS 되어서 user.me가 생김
  // 해결책 => me.id = 0 을 기본값으로 하여 서버에서 처리
  return { id: context.query.id };
};

export default Profile;
