import React, { useState, useCallback, memo } from 'react';
import { Card, Avatar, List, Comment, Dropdown } from 'antd';
import {
  RetweetOutlined,
  HeartOutlined,
  MessageOutlined,
  EllipsisOutlined,
  HeartTwoTone,
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import styled from 'styled-components';
import {
  LOAD_COMMENTS_REQUEST,
  UNLIKE_POST_REQUEST,
  LIKE_POST_REQUEST,
  RETWEET_REQUEST,
} from '../reducers/post';
import PostImages from '../components/PostImages';
import PostCardContent from '../components/PostCardContent';
import CommentForm from './CommentForm';
import FollowButton from './FollowButton';
import EllipsisMenu from './EllipsisMenu';

const PostCard = memo(({ post }) => {
  const [commentFormOpened, setCommentFormOpened] = useState(false);

  const { me } = useSelector((state) => state.user);
  const { isLoadingComments } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const liked = me && post.Likers && post.Likers.find((v) => v.id === me.id);

  const toggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
    if (!commentFormOpened) {
      dispatch({
        type: LOAD_COMMENTS_REQUEST,
        data: post.id,
      });
    }
  }, [commentFormOpened]);

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
            <Dropdown
              overlay={<EllipsisMenu post={post} />}
              trigger={['click']}
            >
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
        extra={<FollowButton me={me} post={post} />}
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
          <CommentForm post={post} />
          <List
            header={`${post.Comments ? post.Comments.length : 0} 댓글`}
            itemLayout='horizontal'
            dataSource={post.Comments || []}
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
});

PostCard.propTypes = {
  post: PropTypes.shape({
    User: PropTypes.object,
    content: PropTypes.string,
    img: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.array,
  }),
};

export default PostCard;
