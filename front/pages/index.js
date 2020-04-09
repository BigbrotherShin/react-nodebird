// Next import React form 'react' 할 필요가 없다.
import React, { useEffect, useCallback, useRef } from 'react';
import PostForm from '../containers/PostForm';
import PostCard from '../containers/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_MAIN_POSTS_REQUEST, UNLOAD_MAINPOSTS } from '../reducers/post';

const Home = () => {
  const { me, isLoggedIn } = useSelector((state) => state.user);
  const { mainPosts, hasMorePost } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const countRef = useRef([]);

  const onScroll = () => {
    if (
      window.scrollY + document.documentElement.clientHeight >
      document.documentElement.scrollHeight - 300
    ) {
      if (mainPosts.length && hasMorePost) {
        const lastId = mainPosts[mainPosts.length - 1].id;
        if (!countRef.current.includes(lastId)) {
          dispatch({
            type: LOAD_MAIN_POSTS_REQUEST,
            lastId,
          });
          countRef.current.push(lastId);
        }
      }
    }
  };

  // useEffect(() => {
  //   return () => {
  //     dispatch({
  //       type: UNLOAD_MAINPOSTS,
  //     });
  //   };
  // }, []);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts.length]);

  return (
    <div>
      {isLoggedIn && <PostForm />}
      {mainPosts.map((p, i) => {
        return <PostCard key={p.id} post={p} />;
      })}
    </div>
  );
};

Home.getInitialProps = async (context) => {
  // console.log(Object.keys(context.store));
  if (context.store.getState().post.gotPosts) {
    context.store.dispatch({
      type: UNLOAD_MAINPOSTS,
    });
  }
  context.store.dispatch({
    type: LOAD_MAIN_POSTS_REQUEST,
  });
};

export default Home;
