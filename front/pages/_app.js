// Next가 자동적으로 이 컴포넌트를 부모컴포넌트로 인식
// pages 들의 공통적인 부분을 모아줘라
import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import AppLayout from '../components/AppLayout';
import { Provider } from 'react-redux';
import reducer from '../reducers';
import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();

const makeStore = (initialState, options) => {
  // 여기에 store 커스터마이징
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

  sagaMiddleware.run(rootSaga); // Saga 실행

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
  // pageProps: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

NodeBird.getInitialProps = async context => {
  console.log('CONTEXT', context);
  const { ctx, Component } = context; // next에서 넣어주는 context
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
};

export default withRedux(makeStore)(NodeBird);
