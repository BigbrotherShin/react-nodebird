import React from 'react';
import { Button, List, Card } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import NicknameEditForm from '../components/NicknameEditForm';
import { useSelector } from 'react-redux';

const dummyProfile = {
  name: '신주현',
};

const Profile = () => {
  const { me } = useSelector(state => state.user);

  return me ? (
    <div>
      <NicknameEditForm me={me} />
      <List
        style={{ marginBottom: '20px' }}
        grid={{ gutter: 4, xs: 2, md: 3 }}
        size='small'
        header={<div>팔로워 목록</div>}
        loadMore={<Button style={{ width: '100%' }}>더 보기</Button>}
        bordered
        dataSource={me.Followers}
        renderItem={item => (
          <List.Item style={{ maginTop: '20px' }}>
            <Card actions={[<StopOutlined key='stop' />]}>
              <Card.Meta description={item} />
            </Card>
          </List.Item>
        )}
      />
      <List
        style={{ marginBottom: '20px' }}
        grid={{ gutter: 4, xs: 2, md: 3 }}
        size='small'
        header={<div>팔로잉 목록</div>}
        loadMore={<Button style={{ width: '100%' }}>더 보기</Button>}
        bordered
        dataSource={me.Followings}
        renderItem={item => (
          <List.Item style={{ maginTop: '20px' }}>
            <Card actions={[<StopOutlined />]}>
              <Card.Meta description={item} />
            </Card>
          </List.Item>
        )}
      />
    </div>
  ) : (
    <div>로그인이 되어있지 않습니다.</div>
  );
};

export default Profile;
