import {
  all,
  fork,
  takeLatest,
  takeEvery,
  call,
  put,
  take,
  delay,
} from 'redux-saga/effects';
import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_FAILURE,
  SIGN_UP_SUCCESS,
} from '../reducers/user';
import axios from 'axios';

function loginAPI(loginData) {
  // 서버에 요청을 보내는 부분
  return axios.post('/login', loginData);
}

function* login(action) {
  // 실제 어떻게 동작할지 작성
  try {
    // yield fork(logger); // fork는 비동기 요청. logger는 내 기록을 로깅하는 함수. 10초 걸림
    yield call(loginAPI, action.data); // call은 동기 요청
    yield put({
      //put은 dispatch와 동일
      type: LOG_IN_SUCCESS,
    });
  } catch (e) {
    console.error(e); // loginAPI 실패
    yield put({
      type: LOG_IN_FAILURE,
      error: e,
    });
  }
}

function* watchLogin() {
  yield takeEvery(LOG_IN_REQUEST, login);
}

function signUpAPI(signUpData) {
  // 서버에 요청을 보내는 부분
  return axios.post('http://localhost:3065/api/user/', signUpData);
}

function* signUp(action) {
  try {
    // yield call(signUpAPI);
    yield call(signUpAPI, action.data);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: e,
    });
    console.error(e);
  }
}

function* watchSignUp() {
  yield takeEvery(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
  yield all([fork(watchLogin), fork(watchSignUp)]);
}
