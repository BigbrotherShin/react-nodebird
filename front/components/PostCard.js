import React, { useState, useCallback, useEffect } from 'react';
import {
  Card,
  Button,
  Avatar,
  Form,
  Input,
  List,
  Comment,
  Dropdown,
  Menu,
} from 'antd';
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
  RETWEET_REQUEST,
  REMOVE_POST_REQUEST,
} from '../reducers/post';
import Link from 'next/link';
import PostImages from './PostImages';
import PostCardContent from './PostCardContent';
import { UNFOLLOW_USER_REQUEST, FOLLOW_USER_REQUEST } from '../reducers/user';
import EditModal from './EditModal';
import styled from 'styled-components';

const PostCard = ({ post }) => {
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [postEditVisible, setPostEditVisible] = useState(false);
  const { me } = useSelector((state) => state.user);
  const { commentAdded, isAddingComment, isLoadingComments } = useSelector(
    (state) => state.post,
  );
  const dispatch = useDispatch();

  const liked = me && post.Likers && post.Likers.find((v) => v.id === me.id);

  useEffect(() => {
    if (commentAdded) {
      setCommentText('');
    }
    // console.log('front/components/PostCard post: ', post);
  }, [commentAdded === true]);

  const toggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
    if (!commentFormOpened) {
      dispatch({
        type: LOAD_COMMENTS_REQUEST,
        data: post.id,
      });
    }
  }, [commentFormOpened]);

  const onChangeCommentText = useCallback((e) => {
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
      // console.log('components/PostCard.js liked: ', liked);
      return dispatch({
        type: UNLIKE_POST_REQUEST,
        data: post.id,
      });
    } else {
      // 좋아요를 안 누른 상태
      // console.log('components/PostCard.js liked: ', liked);
      return dispatch({
        type: LIKE_POST_REQUEST,
        data: post.id,
      });
    }
  }, [me && me.id, post && post.id, liked]);

  const onRetweet = useCallback(() => {
    if (!me) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [me && me.id, post && post.id]);

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
  const onPostDelete = useCallback(() => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, [post.id]);

  const onPostEditVisible = useCallback(() => {
    setPostEditVisible((prevState) => !prevState);
  }, []);

  const menu = (
    <Menu>
      <Menu.Item key='0' onClick={onPostEditVisible}>
        수정
      </Menu.Item>
      <EditModal
        postEditVisible={postEditVisible}
        setPostEditVisible={setPostEditVisible}
        post={post}
      />
      <Menu.Item key='1' onClick={onPostDelete}>
        삭제
      </Menu.Item>
    </Menu>
  );

  const CardWrapper = styled.div`
    margin-bottom: 20px;
  `;

  return (
    <CardWrapper>
      {/* <Link
        href={{
          pathname: '/post',
          query: { id: post.id },
        }}
        as={`/post/${post.id}`}
      >
        <a> */}
      {/* <div> */}
      <Card
        hoverable
        key={+post.createdAt}
        cover={
          post.Images && post.Images[0] && <PostImages images={post.Images} />
        }
        actions={[
          <RetweetOutlined key='retweet' onClick={onRetweet} />,
          liked ? (
            <HeartTwoTone
              key='heart'
              twoToneColor='#eb2f96'
              onClick={onToggleLike}
            />
          ) : (
            <HeartOutlined key='heart' onClick={onToggleLike} />
          ),
          <MessageOutlined
            key='message'
            onClick={toggleComment}
            loading={isLoadingComments}
          />,
          <span>
            <Dropdown overlay={menu} trigger={['click']}>
              <a
                className='ant-dropdown-link'
                onClick={(e) => e.preventDefault()}
              >
                <EllipsisOutlined key='ellipsis' />
              </a>
            </Dropdown>
            {/* {post.Comments ? post.Comments.length : 0} */}
          </span>,
        ]}
        title={
          post.RetweetId ? `${post.User.nickname}님이 리트윗 하셨습니다.` : null
        }
        extra={
          !me || post.User.id === me.id ? null : me.Followings &&
            me.Followings.find((v) => v.id === post.UserId) ? (
            <Button onClick={onUnfollow(post.User.id)}>언팔로우</Button>
          ) : (
            <Button onClick={onFollow(post.User.id)}>팔로우</Button>
          )
        }
      >
        {post.RetweetId && post.Retweet ? (
          <Card
            key={+post.Retweet.createdAt}
            cover={
              post.Retweet.Images &&
              post.Retweet.Images[0] && (
                <PostImages images={post.Retweet.Images} />
              )
            }
          >
            <Card.Meta
              avatar={
                <Link
                  href={{
                    pathname: '/user',
                    query: { id: post.Retweet.User.id },
                  }}
                  as={`/user/${post.Retweet.User.id}`}
                >
                  <a>
                    <Avatar>{post.Retweet.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={
                <Link
                  href={{
                    pathname: '/user',
                    query: { id: post.Retweet.User.id },
                  }}
                  as={`/user/${post.Retweet.User.id}`}
                >
                  <a style={{ color: '#7F7C7C' }}>
                    {post.Retweet.User.nickname}
                  </a>
                </Link>
              }
              description={<PostCardContent postData={post.Retweet.content} />} // a tag x -> Next Link
            />
          </Card>
        ) : (
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
            description={<PostCardContent postData={post.content} />} // a tag x -> Next Link
          />
        )}
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
                  // datetime={item.createdAt}
                />
              </List.Item>
            )}
          />
        </>
      )}
      {/* </div> */}
      {/* </a>
      </Link> */}
    </CardWrapper>
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
