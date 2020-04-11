import React, { memo } from 'react';
import { List, Comment, Avatar, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import Link from 'next/link';

moment.locale('ko');

const CommentList = memo(({ comments }) => {
  return (
    <List
      header={`${comments ? comments.length : 0} 댓글`}
      itemLayout='horizontal'
      dataSource={comments || []}
      renderItem={(item) => (
        <List.Item>
          <Comment
            author={item.User.nickname}
            avatar={
              <Link
                href={{
                  pathname: '/user',
                  query: { id: item.User.id },
                }}
                as={`/user/${item.User.id}`}
              >
                <a>
                  <Avatar>{item.User.nickname[0]}</Avatar>
                </a>
              </Link>
            }
            content={item.content}
            datetime={
              <Tooltip
                title={moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              >
                <span>{moment(item.createdAt).fromNow()}</span>
              </Tooltip>
            }
          />
        </List.Item>
      )}
    />
  );
});

CommentList.propTypes = {
  comments: PropTypes.array.isRequired,
};

export default CommentList;
