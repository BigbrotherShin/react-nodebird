import React, { useCallback, memo } from 'react';
import { Card, Avatar, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { LOG_OUT_REQUEST } from '../reducers/user';
import Link from 'next/link';

const UserProfile = memo(() => {
  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const onLogout = useCallback(() => {
    dispatch({
      type: LOG_OUT_REQUEST,
    });
  }, []);

  return (
    <Card
      actions={[
        <Link
          key='twit'
          href={{ pathname: '/profile', query: { id: me.id } }}
          as={`/profile/${me.id}`}
        >
          <a>
            <div>
              게시물
              <br />
              {me.Posts.length}
            </div>
          </a>
        </Link>,
        ,
        <Link
          key='following'
          href={{ pathname: '/profile', query: { id: me.id } }}
          as={`/profile/${me.id}`}
        >
          <a>
            <div>
              팔로잉
              <br />
              {me.Followings.length}
            </div>
          </a>
        </Link>,
        <Link
          key='follower'
          href={{ pathname: '/profile', query: { id: me.id } }}
          as={`/profile/${me.id}`}
        >
          <a>
            <div>
              팔로워
              <br />
              {me.Followers.length}
            </div>
          </a>
        </Link>,
      ]}
    >
      <Card.Meta
        avatar={<Avatar>{me.nickname[0]}</Avatar>}
        title={me.nickname}
        description='This is the description'
      />
      <Button onClick={onLogout}>로그아웃</Button>
    </Card>
  );
});

export default UserProfile;
