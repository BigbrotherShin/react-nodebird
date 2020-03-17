import React from 'react';
import { Button, List, Card } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import NicknameEditForm from '../components/NicknameEditForm';

const dummyProfile = {
  name: '신주현',
};

const Profile = () => {
  return (
    <div>
      <NicknameEditForm dummyProfile={dummyProfile} />
      <List
        style={{ marginBottom: '20px' }}
        grid={{ gutter: 4, xs: 2, md: 3 }}
        size='small'
        header={<div>팔로워 목록</div>}
        loadMore={<Button style={{ width: '100%' }}>더 보기</Button>}
        bordered
        dataSource={['SJH', 'YWK', 'NodeBird']}
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
        dataSource={['SJH', 'YWK', 'NodeBird']}
        renderItem={item => (
          <List.Item style={{ maginTop: '20px' }}>
            <Card actions={[<StopOutlined />]}>
              <Card.Meta description={item} />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Profile;
