import React, { useCallback } from 'react';
import { Button, List, Card } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import NicknameEditForm from '../components/NicknameEditForm';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  REMOVE_FOLLOWER_REQUEST,
  UNFOLLOW_USER_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_USER_REQUEST,
} from '../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/PostCard';
import Axios from 'axios';

const Profile = () => {
  const dispatch = useDispatch();
  const { mainPosts } = useSelector(state => state.post);
  const { me, followingList, followerList } = useSelector(state => state.user);

  const onFollwerDelete = useCallback(
    id => () => {
      dispatch({
        type: REMOVE_FOLLOWER_REQUEST,
        data: id,
      });
    },
    [],
  );

  const onFollowingDelete = useCallback(
    id => () => {
      dispatch({
        type: UNFOLLOW_USER_REQUEST,
        data: id,
      });
    },
    [],
  );

  return me ? (
    <div>
      <NicknameEditForm />
      <List
        style={{ marginBottom: '20px' }}
        grid={{ gutter: 4, xs: 2, md: 3 }}
        size='small'
        header={<div>팔로워 목록</div>}
        loadMore={<Button style={{ width: '100%' }}>더 보기</Button>}
        bordered
        dataSource={followerList}
        renderItem={item => {
          return (
            <List.Item style={{ maginTop: '20px' }}>
              <Card
                actions={[
                  <StopOutlined
                    key={item}
                    onClick={onFollwerDelete(item.id)}
                  />,
                ]}
              >
                <Card.Meta description={item.nickname} />
              </Card>
            </List.Item>
          );
        }}
      />
      <List
        style={{ marginBottom: '20px' }}
        grid={{ gutter: 4, xs: 2, md: 3 }}
        size='small'
        header={<div>팔로잉 목록</div>}
        loadMore={<Button style={{ width: '100%' }}>더 보기</Button>}
        bordered
        dataSource={followingList}
        renderItem={item => {
          return (
            <List.Item style={{ maginTop: '20px' }}>
              <Card
                actions={[
                  <StopOutlined
                    key={item}
                    onClick={onFollowingDelete(item.id)}
                  />,
                ]}
              >
                <Card.Meta description={item.nickname} />
              </Card>
            </List.Item>
          );
        }}
      />
      <List
        style={{ marginBottom: '20px' }}
        // grid={{ gutter: 4, xs: 2, md: 3 }}
        // size='large'
        header={<div>게시물</div>}
        loadMore={<Button style={{ width: '100%' }}>더 보기</Button>}
        bordered
        dataSource={mainPosts}
        renderItem={item => {
          return <PostCard key={item} post={item} />;
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

Profile.getInitialProps = async context => {
  // 이 직전에 LOAD_USER_REQUEST -> 이 요청이 끝나야 user.me가 생성됨
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
