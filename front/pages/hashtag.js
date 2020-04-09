import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  LOAD_HASHTAG_POSTS_REQUEST,
  UNLOAD_MAINPOSTS,
  LOAD_MAIN_POSTS_REQUEST,
} from '../reducers/post';
import PostCard from '../containers/PostCard';

const Hashtag = ({ tag }) => {
  const { mainPosts, hasMorePost } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const onScroll = () => {
    if (
      window.scrollY + document.documentElement.clientHeight >
      document.documentElement.scrollHeight - 300
    ) {
      if (mainPosts.length && hasMorePost) {
        dispatch({
          type: LOAD_HASHTAG_POSTS_REQUEST,
          data: tag,
          lastId: mainPosts[mainPosts.length - 1].id,
        });
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts.length]);

  return (
    <div>
      {mainPosts.map((c) => (
        <PostCard key={+c.createdAt} post={c} />
      ))}
    </div>
  );
};

Hashtag.getInitialProps = async (context) => {
  // console.log('Hashtag getInitialProps: ', context.query.tag);
  const dispatch = context.store.dispatch;
  if (context.store.getState().post.gotPosts) {
    dispatch({
      type: UNLOAD_MAINPOSTS,
    });
  }
  const tag = context.query.tag;
  context.store.dispatch({
    type: LOAD_HASHTAG_POSTS_REQUEST,
    data: tag,
  });
  return { tag };
};

export default Hashtag;
