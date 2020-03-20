// Next import React form 'react' 할 필요가 없다.
import React, { useEffect } from 'react';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { useDispatch, useSelector } from 'react-redux';

const Home = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector(state => state.user);
  const { mainPosts } = useSelector(state => state.post);

  return (
    <div>
      {/* {user ? <div>Login: {user.nickname}</div> : <div>Logout!!</div>} */}
      {isLoggedIn && <PostForm />}
      {mainPosts.map((c, i) => {
        return <PostCard key={`posts${i}`} post={c} />;
      })}
    </div>
  );
};

export default Home;
