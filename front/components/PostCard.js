import React, { useState, useCallback, useEffect } from 'react';
import { Card, Button, Avatar, Form, Input, List, Comment } from 'antd';
import {
  RetweetOutlined,
  HeartOutlined,
  MessageOutlined,
  EllipsisOutlined,
  HeartTwoTone,
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  ADD_COMMENT_REQUEST,
  LOAD_COMMENTS_REQUEST,
  UNLIKE_POST_REQUEST,
  LIKE_POST_REQUEST,
} from '../reducers/post';
import Link from 'next/link';
import PostImages from './PostImages';

const PostCard = ({ post }) => {
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { me } = useSelector(state => state.user);
  const { commentAdded, isAddingComment, isLoadingComments } = useSelector(
    state => state.post,
  );
  const dispatch = useDispatch();

  const liked = me && post.Likers && post.Likers.find(v => v.id === me.id);

  useEffect(() => {
    if (commentAdded) {
      setCommentText('');
    }
    // console.log('front/components/PostCard post: ', post);
  }, [commentAdded === true]);

  const toggleComment = useCallback(() => {
    setCommentFormOpened(prev => !prev);
    if (!commentFormOpened) {
      dispatch({
        type: LOAD_COMMENTS_REQUEST,
        data: post.id,
      });
    }
  }, [commentFormOpened]);

  const onChangeCommentText = useCallback(e => {
    setCommentText(e.target.value);
  }, []);

  const onSubmitComment = useCallback(() => {
    if (!me) {
      return alert('로그인이 필요합니다.');
    }
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: {
        postId: post.id,
        content: commentText,
      },
    });
  }, [me && me.id, commentText]);

  const onToggleLike = useCallback(() => {
    if (!me) {
      return alert('로그인이 필요합니다.');
    }
    if (liked) {
      // 좋아요를 누른 상태
      return dispatch({
        type: UNLIKE_POST_REQUEST,
        data: post.id,
      });
    } else {
      // 좋아요를 안 누른 상태
      return dispatch({
        type: LIKE_POST_REQUEST,
        data: post.id,
      });
    }
  }, [me && me.id, post && post.id]);

  return (
    <div>
      <Card
        key={+post.createdAt}
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key='retweet' />,
          liked ? (
            <HeartTwoTone twoToneColor='#eb2f96' onClick={onToggleLike} />
          ) : (
            <HeartOutlined key='heart' onClick={onToggleLike} />
          ),
          <span>
            <MessageOutlined
              key='message'
              onClick={toggleComment}
              loading={isLoadingComments}
            />
            {/* {post.Comments ? post.Comments.length : 0} */}
          </span>,
          <EllipsisOutlined key='ellipsis' />,
        ]}
        extra={<Button>팔로우</Button>}
      >
        <Card.Meta
          avatar={
            <Link
              href={{ pathname: '/user', query: { id: post.User.id } }}
              as={`/user/${post.User.id}`}
            >
              <a>
                <Avatar>{post.User.nickname[0]}</Avatar>
              </a>
            </Link>
          }
          title={
            <Link
              href={{ pathname: '/user', query: { id: post.User.id } }}
              as={`/user/${post.User.id}`}
            >
              <a style={{ color: '#7F7C7C' }}>{post.User.nickname}</a>
            </Link>
          }
          description={
            // React에서 Hashtag에 링크 설정하는 방법
            <div>
              {post.content.split(/(#[^\s]+)/g).map(v => {
                if (v.match(/(#[^\s]+)/g)) {
                  return (
                    <Link
                      href={{
                        pathname: '/hashtag',
                        query: { tag: v.slice(1) },
                      }}
                      as={`/hashtag/${v.slice(1)}`}
                      key={v}
                    >
                      <a>{v}</a>
                    </Link>
                  );
                }
                return v;
              })}
            </div>
          } // a tag x -> Next Link
        />
      </Card>
      {commentFormOpened && (
        <>
          <Form onFinish={onSubmitComment}>
            <Form.Item>
              <Input.TextArea
                rows={4}
                value={commentText}
                onChange={onChangeCommentText}
              />
            </Form.Item>
            <Button type='primary' htmlType='submit' loading={isAddingComment}>
              삐약
            </Button>
          </Form>
          <List
            header={`${post.comments ? post.comments.length : 0} 댓글`}
            itemLayout='horizontal'
            dataSource={post.comments || []}
            renderItem={item => (
              <List.Item>
                <Comment
                  author={item.User.nickname}
                  avatar={
                    <Link
                      href={{ pathname: '/user', query: { id: item.User.id } }}
                      as={`/user/${item.User.id}`}
                    >
                      <a>
                        <Avatar>{item.User.nickname[0]}</Avatar>
                      </a>
                    </Link>
                  }
                  content={item.content}
                  // datetime={item.createdAt}
                />
              </List.Item>
            )}
          />
        </>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    User: PropTypes.object,
    content: PropTypes.string,
    img: PropTypes.string,
    createdAt: PropTypes.string,
    comments: PropTypes.array,
  }),
};

export default PostCard;
