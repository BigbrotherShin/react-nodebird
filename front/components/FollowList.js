import React, { memo } from 'react';
import { Button, List, Card } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const FollowList = memo(({ header, hasMore, loadMore, data, unFollow }) => {
  return (
    <List
      style={{ marginBottom: '20px' }}
      grid={{ gutter: 4, xs: 2, md: 3 }}
      size='small'
      header={<div>{header} 목록</div>}
      loadMore={
        hasMore ? (
          <Button style={{ width: '100%' }} onClick={loadMore}>
            더 보기
          </Button>
        ) : null
      }
      bordered
      dataSource={data}
      renderItem={(item) => {
        return (
          <List.Item style={{ maginTop: '20px' }}>
            <Card
              actions={[
                <StopOutlined
                  key={item.id}
                  onClick={unFollow && unFollow(item.id)}
                />,
              ]}
            >
              <Card.Meta description={item.nickname} />
            </Card>
          </List.Item>
        );
      }}
    />
  );
});

FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  hasMore: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  unFollow: PropTypes.func.isRequired,
};

export default FollowList;
