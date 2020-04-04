// Next가 자동적으로 이 컴포넌트를 부모컴포넌트로 인식
// pages 들의 공통적인 부분을 모아줘라
import React from 'react';
import Head from 'next/head';
import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import AppLayout from '../components/AppLayout';
import reducer from '../reducers';
import rootSaga from '../sagas';
import { LOAD_USER_REQUEST } from '../reducers/user';
import Axios from 'axios';

const makeStore = (initialState, options) => {
  // 여기에 store 커스터마이징

  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware]; // 미들웨어는 action과 store 사이에서 동작
  // const enhancer = compose(applyMiddleware([...middlewares]));

  const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    process.env.NODE_ENV !== 'production'
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        })
      : compose;

  const enhancer = composeEnhancers(
    applyMiddleware(...middlewares),
    // other store enhancers if any
  );

  const store = createStore(reducer, initialState, enhancer);

  store.sagaTask = sagaMiddleware.run(rootSaga); // Saga 실행

  return store;
};

function NodeBird({ Component, pageProps, store }) {
  return (
    <Provider store={store}>
      <Head>
        <title>Node Bird</title>
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/antd/4.0.1/antd.css'
        />
        <link
          rel='stylesheet'
          type='text/css'
          charSet='UTF-8'
          href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css'
        />
        <link
          rel='stylesheet'
          type='text/css'
          href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css'
        />
      </Head>
      <AppLayout>
        <Component {...pageProps} /> {/* Component JSX 형식으로 작성할 것 */}
        {/* Next에서 pages 폴더 내의 Components를 자동적으로 props로 넣어줌 */}
      </AppLayout>
    </Provider>
  );
}

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
  store: PropTypes.object.isRequired,
  pageProps: PropTypes.object.isRequired,
};

NodeBird.getInitialProps = async context => {
  // console.log('_app.js CONTEXT', context);
  const { ctx, Component } = context; // next에서 넣어주는 context
  let pageProps = {};
  const state = ctx.store.getState();
  const cookie = ctx.isServer ? ctx.req.headers.cookie : '';
  // SSR 환경일 때만 서버사이드에서 쿠키를 넣어주고, 클라이언트 환경일 때는 넣지 않음
  if (ctx.isServer && cookie) {
    // 서버 환경일 때만 쿠키를 심어줌.
    Axios.defaults.headers.Cookie = cookie; // defaluts: 모든 axios 요청 시에 쿠키 데이터를 심어줌.
  }
  if (!state.user.me) {
    ctx.store.dispatch({
      type: LOAD_USER_REQUEST,
    });
  }
  if (Component.getInitialProps) {
    // Component (pages 폴더에 있는 컴포넌트)에 getInitialProps가 있다면
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps };
};

export default withRedux(makeStore)(withReduxSaga(NodeBird));
