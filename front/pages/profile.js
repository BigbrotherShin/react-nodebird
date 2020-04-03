import React, { useEffect, useCallback } from 'react';
import { Button, List, Card, Collapse } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import NicknameEditForm from '../components/NicknameEditForm';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  REMOVE_FOLLOWER_REQUEST,
  UNFOLLOW_USER_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWERS_REQUEST,
} from '../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/PostCard';

const dummyProfile = {
  name: '신주현',
};

const Profile = ({ id }) => {
  const dispatch = useDispatch();
  const { mainPosts } = useSelector(state => state.post);
  const { me, followingList, followerList } = useSelector(state => state.user);

  useEffect(() => {
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
      data: id,
    });
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
      data: id,
    });
    dispatch({
      type: LOAD_USER_POSTS_REQUEST,
      data: id,
    });
  }, []);

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
  // console.log('Hashtag getInitialProps: ', context.query.tag);
  return { id: context.query.id };
};

export default Profile;
