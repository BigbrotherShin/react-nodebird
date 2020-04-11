import React, { useState, useCallback, memo } from 'react';
import { Card, Avatar, Dropdown, Tooltip, Modal } from 'antd';
import {
  RetweetOutlined,
  HeartOutlined,
  MessageOutlined,
  EllipsisOutlined,
  HeartTwoTone,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import styled from 'styled-components';
import moment from 'moment';
import {
  LOAD_COMMENTS_REQUEST,
  UNLIKE_POST_REQUEST,
  LIKE_POST_REQUEST,
  RETWEET_REQUEST,
  REMOVE_POST_REQUEST,
} from '../reducers/post';
import PostImages from '../components/PostImages';
import PostCardContent from '../components/PostCardContent';
import CommentForm from './CommentForm';
import FollowButton from './FollowButton';
import EllipsisMenu from './EllipsisMenu';
import CommentList from '../components/CommentList';
import EditModal from './EditModal';

moment.locale('ko');

const { confirm } = Modal;

const PostTimestamp = styled(Tooltip)`
  display: inline-block;
  float: right;
  color: #cccccc;
  font-size: 14px;
  margin-top: 8px;
`;

const PostCard = memo(({ post }) => {
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [postEditVisible, setPostEditVisible] = useState(false);

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

  const showConfirm = useCallback(
    (id) => () => {
      confirm({
        title: '정말로 포스트를 삭제하시겠습니까?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          dispatch({
            type: REMOVE_POST_REQUEST,
            data: id,
          });
        },
      });
    },
    [],
  );

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
          <>
            {liked ? (
              <HeartTwoTone
                style={{ display: 'inline' }}
                key='heart'
                twoToneColor='#eb2f96'
                onClick={onToggleLike}
              />
            ) : (
              <HeartOutlined
                style={{ display: 'inline' }}
                key='heart'
                onClick={onToggleLike}
              />
            )}
            {post.Likers && post.Likers.length}
          </>,
          <MessageOutlined
            key='message'
            onClick={toggleComment}
            loading={isLoadingComments}
          />,
          <span>
            <Dropdown
              overlay={
                <EllipsisMenu
                  post={post}
                  setPostEditVisible={setPostEditVisible}
                  showConfirm={showConfirm}
                />
              }
              trigger={['click']}
            >
              <a
                className='ant-dropdown-link'
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <EllipsisOutlined key='ellipsis' />
              </a>
            </Dropdown>
            <EditModal
              postEditVisible={postEditVisible}
              setPostEditVisible={setPostEditVisible}
              post={post}
            />
          </span>,
        ]}
        title={
          <>
            {post.RetweetId
              ? `${post.User.nickname}님이 리트윗 하셨습니다.`
              : null}
          </>
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
            description={
              <>
                <PostCardContent postData={post.content} />

                <PostTimestamp
                  title={moment(post.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                >
                  <span>{moment(post.createdAt).fromNow()}</span>
                </PostTimestamp>
              </>
            } // a tag x -> Next Link
          />
        )}
      </Card>
      {commentFormOpened && (
        <>
          <CommentForm post={post} />
          <CommentList comments={post.Comments} />
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
