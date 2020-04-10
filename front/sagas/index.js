import { all, fork } from 'redux-saga/effects';
import Axios from 'axios';
import user from './user';
import post from './post';
import { backUrl } from '../config/config';

Axios.defaults.baseURL = `${backUrl}/api`;

export default function* rootSaga() {
  yield all([fork(user), fork(post)]);
}
