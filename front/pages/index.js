// Next import React form 'react' 할 필요가 없다.
import React, { useEffect } from 'react';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_MAIN_POSTS_REQUEST } from '../reducers/post';

const Home = () => {
  const dispatch = useDispatch();
  const { me, isLoggedIn } = useSelector(state => state.user);
  const { mainPosts } = useSelector(state => state.post);

  useEffect(() => {
    dispatch({
      type: LOAD_MAIN_POSTS_REQUEST,
    });
  }, []);

  return (
    <div>
      {/* {user ? <div>Login: {user.nickname}</div> : <div>Logout!!</div>} */}
      {isLoggedIn && <PostForm />}
      {mainPosts.map((p, i) => {
        return <PostCard key={`posts${i}`} post={p} />;
      })}
    </div>
  );
};

export default Home;
