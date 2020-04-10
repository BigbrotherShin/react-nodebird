import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { LOAD_POST_REQUEST } from '../reducers/post';
import PostCard from '../containers/PostCard';
import Helmet from 'react-helmet';

const Post = ({ id }) => {
  const { singlePost } = useSelector((state) => state.post);

  return (
    <>
      <Helmet
        title={`${singlePost.User.nickname}님의 글`}
        description={`${singlePost.content}`}
        meta={[
          {
            name: 'description',
            content: singlePost.content,
          },
          {
            property: 'og:title',
            content: `${singlePost.User.nickname}님의 게시글`,
          },
          {
            property: 'og:description',
            content: singlePost.content,
          },
          {
            property: 'og:image',
            content:
              singlePost.Images &&
              singlePost.Images[0] &&
              `http://api.bigbroshin/${singlePost.Images[0].src}`,
          },
          {
            property: 'og:url',
            content: `http://bigbroshin/post/${id}`,
          },
        ]}
      />
      <PostCard post={singlePost} />
    </>
  );
};

Post.getInitialProps = async (context) => {
  context.store.dispatch({
    type: LOAD_POST_REQUEST,
    data: context.query.id,
  });

  return { id: parseInt(context.query.id, 10) };
};

Post.propTypes = {
  id: PropTypes.number.isRequired,
};

export default Post;
