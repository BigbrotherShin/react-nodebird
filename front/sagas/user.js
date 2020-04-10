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
  LOG_OUT_REQUEST,
  LOG_OUT_FAILURE,
  LOG_OUT_SUCCESS,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE,
  LOAD_USER_REQUEST,
  FOLLOW_USER_SUCCESS,
  FOLLOW_USER_FAILURE,
  FOLLOW_USER_REQUEST,
  UNFOLLOW_USER_SUCCESS,
  UNFOLLOW_USER_FAILURE,
  UNFOLLOW_USER_REQUEST,
  LOAD_FOLLOWINGS_SUCCESS,
  LOAD_FOLLOWINGS_FAILURE,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWERS_SUCCESS,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWERS_REQUEST,
  REMOVE_FOLLOWER_SUCCESS,
  REMOVE_FOLLOWER_FAILURE,
  REMOVE_FOLLOWER_REQUEST,
  EDIT_USER_NICKNAME_SUCCESS,
  EDIT_USER_NICKNAME_FAILURE,
  EDIT_USER_NICKNAME_REQUEST,
} from '../reducers/user';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3065/api';

function loginAPI(loginData) {
  // 서버에 요청을 보내는 부분
  return axios.post('/user/login', loginData, {
    withCredentials: true,
  });
}

function* login(action) {
  // 실제 어떻게 동작할지 작성
  try {
    // yield fork(logger); // fork는 비동기 요청. logger는 내 기록을 로깅하는 함수. 10초 걸림
    const result = yield call(loginAPI, action.data); // call은 동기 요청
    // console.log(result.data);
    yield put({
      //put은 dispatch와 동일
      type: LOG_IN_SUCCESS,
      data: result.data, // 서버에서 보내준 fullUser 객체
    });
  } catch (e) {
    console.dir(e); // loginAPI 실패
    yield put({
      type: LOG_IN_FAILURE,
      error: e.response && e.response.data,
    });
  }
}

function* watchLogin() {
  yield takeEvery(LOG_IN_REQUEST, login);
}

function logoutAPI() {
  axios.post(
    '/user/logout',
    {},
    {
      withCredentials: true,
    },
  );
}

function* logout() {
  try {
    yield call(logoutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (e) {
    console.error(e),
      put({
        type: LOG_OUT_FAILURE,
        error: e,
      });
  }
}

function* watchLogout() {
  yield takeEvery(LOG_OUT_REQUEST, logout);
}

function loadUserAPI(userId) {
  // 서버에 요청을 보내는 부분
  return axios.get(userId ? `/user/${userId}` : '/user/', {
    withCredentials: userId ? false : true, // 클라이언트에서 요청 보낼 때는 브라우저가 쿠키를 같이 동봉
  }); // 서버사이드렌더링일 때는, 브라우저가 없음 -> 따라서 개발자가 직접 쿠키를 넣어서 서버에 요청하여야 함
}

function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
      me: !action.data,
    });
  } catch (e) {
    yield put({
      type: LOAD_USER_FAILURE,
      error: e,
    });
    console.error(e);
  }
}

function* watchLoadUser() {
  yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

function signUpAPI(signUpData) {
  // 서버에 요청을 보내는 부분
  return axios.post('/user/', signUpData);
}

function* signUp(action) {
  try {
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

function followUserAPI(followUserData) {
  // 서버에 요청을 보내는 부분
  return axios.post(
    `/user/${followUserData}/following`,
    {},
    {
      withCredentials: true,
    },
  );
}

function* followUser(action) {
  try {
    const result = yield call(followUserAPI, action.data);
    yield put({
      type: FOLLOW_USER_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: FOLLOW_USER_FAILURE,
      error: e,
    });
    console.error(e);
  }
}

function* watchFollowUser() {
  yield takeEvery(FOLLOW_USER_REQUEST, followUser);
}

function unfollowUserAPI(unfollowUserData) {
  // 서버에 요청을 보내는 부분
  return axios.delete(`/user/${unfollowUserData}/following`, {
    withCredentials: true,
  });
}

function* unfollowUser(action) {
  try {
    const result = yield call(unfollowUserAPI, action.data);
    yield put({
      type: UNFOLLOW_USER_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: UNFOLLOW_USER_FAILURE,
      error: e,
    });
    console.error(e);
  }
}

function* watchUnfollowUser() {
  yield takeEvery(UNFOLLOW_USER_REQUEST, unfollowUser);
}

function loadFollowingsAPI(loadFollowingsData, offset = 0, limit = 3) {
  // 서버에 요청을 보내는 부분
  return axios.get(
    `/user/${
      loadFollowingsData || 0
    }/followings?offset=${offset}&limit=${limit}`,
    {
      withCredentials: true,
    },
  );
}

function* loadFollowings(action) {
  try {
    const result = yield call(loadFollowingsAPI, action.data, action.offset);
    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data, // { followings: [...] }
    });
  } catch (e) {
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error: e,
    });
    console.error(e);
  }
}

function* watchLoadFollowings() {
  yield takeEvery(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function loadFollowersAPI(loadFollowersData, offset = 0, limit = 3) {
  // 서버에 요청을 보내는 부분
  return axios.get(
    `/user/${loadFollowersData || 0}/followers?offset=${offset}&limit=${limit}`,
    {
      withCredentials: true,
    },
  );
}

function* loadFollowers(action) {
  try {
    const result = yield call(loadFollowersAPI, action.data, action.offset);
    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data, // { followers: [...] }
    });
  } catch (e) {
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error: e,
    });
    console.error(e);
  }
}

function* watchLoadFollowers() {
  yield takeEvery(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function removeFollowerAPI(removeFollowerData) {
  // 서버에 요청을 보내는 부분
  return axios.delete(`/user/${removeFollowerData}/follower`, {
    withCredentials: true,
  });
}

function* removeFollower(action) {
  try {
    const result = yield call(removeFollowerAPI, action.data);
    yield put({
      type: REMOVE_FOLLOWER_SUCCESS,
      data: result.data, // { followings: [...], followers: [...] }
    });
  } catch (e) {
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error: e,
    });
    console.error(e);
  }
}

function* watchRemoveFollower() {
  yield takeEvery(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

function editUserNicknameAPI(editUserNicknameData) {
  // 서버에 요청을 보내는 부분
  return axios.patch(
    `/user/${editUserNicknameData.id}/edit`,
    editUserNicknameData,
    {
      withCredentials: true,
    },
  );
}

function* editUserNickname(action) {
  try {
    const result = yield call(editUserNicknameAPI, action.data);
    yield put({
      type: EDIT_USER_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: EDIT_USER_NICKNAME_FAILURE,
      error: e,
    });
    console.error(e);
  }
}

function* watchEditUserNickname() {
  yield takeEvery(EDIT_USER_NICKNAME_REQUEST, editUserNickname);
}

export default function* userSaga() {
  yield all([
    fork(watchLogin),
    fork(watchLogout),
    fork(watchLoadUser),
    fork(watchSignUp),
    fork(watchFollowUser),
    fork(watchUnfollowUser),
    fork(watchLoadFollowings),
    fork(watchLoadFollowers),
    fork(watchRemoveFollower),
    fork(watchEditUserNickname),
  ]);
}
