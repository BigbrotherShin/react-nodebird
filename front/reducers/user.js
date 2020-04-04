// const dummyUser = {
//   nickname: '신주현',
//   Post: ['a', 'b', 'c'],
//   Followings: ['a', 'b', 'c'],
//   Followers: ['a', 'b'],
//   LikePosts: [],
//   id: 1,
// };

export const initialState = {
  isLoggedIn: false, // 로그인 여부
  isLoggingOut: false, // 로그아웃 시도중
  isLoggingIn: false, // 로그인 시도중
  logInErrorReason: '', // 로그인 실패 사유
  signedUp: false, // 회원가입 성공
  isSigningUp: false, // 회원가입 시도중
  signUpErrorReason: '', // 회원가입 실패 사유
  logOutErrorReason: '', // 로그아웃 실패 사유
  me: null, // 내 정보
  followingList: [], // 팔로잉 리스트
  followerList: [], // 팔로워 리스트
  userInfo: null, // 남의 정보,
  loadErrorReason: '', // 유저 정보 로드 실패 사유
  loadFollowErrorReason: '', // 팔로우 정보 로드 실패 사유
  isEditingNickname: false, // 닉네임 수정 요청 중
  editNicknameErrorReason: '', // 닉네임 수정 요청 실패 사유
};

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST'; // 액션의 이름
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST'; // 액션의 이름
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST'; // 액션의 이름
export const LOAD_FOLLOWINGS_SUCCESS = 'LOAD_FOLLOWINGS_SUCCESS';
export const LOAD_FOLLOWINGS_FAILURE = 'LOAD_FOLLOWINGS_FAILURE';

export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST'; // 액션의 이름
export const LOAD_FOLLOWERS_SUCCESS = 'LOAD_FOLLOWERS_SUCCESS';
export const LOAD_FOLLOWERS_FAILURE = 'LOAD_FOLLOWERS_FAILURE';

export const FOLLOW_USER_REQUEST = 'FOLLOW_USER_REQUEST'; // 액션의 이름
export const FOLLOW_USER_SUCCESS = 'FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_FAILURE = 'FOLLOW_USER_FAILURE';

export const UNFOLLOW_USER_REQUEST = 'UNFOLLOW_USER_REQUEST'; // 액션의 이름
export const UNFOLLOW_USER_SUCCESS = 'UNFOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_FAILURE = 'UNFOLLOW_USER_FAILURE';

export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST'; // 액션의 이름
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';

export const EDIT_USER_NICKNAME_REQUEST = 'EDIT_USER_NICKNAME_REQUEST';
export const EDIT_USER_NICKNAME_SUCCESS = 'EDIT_USER_NICKNAME_SUCCESS';
export const EDIT_USER_NICKNAME_FAILURE = 'EDIT_USER_NICKNAME_FAILURE';

export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

// export const loginRequestAction = data => ({
//   type: LOG_IN_REQUEST,
//   data,
// });
// export const loginSuccess = () => {
//   return {
//     type: LOG_IN_SUCCESS,
//   };
// };
// export const loginFailure = () => {
//   return {
//     type: LOG_IN_FAILURE,
//     error,
//   };
// };

// export const logoutRequestAction = {
//   type: LOG_OUT_REQUEST,
// };

// export const signUpRequestAction = data => ({ type: SIGN_UP_REQUEST, data });
// // action에 넣을 데이터가 동적인 경우에는 action을 함수로 만든다

// export const sinUpSuccess = {
//   type: SIGN_UP_SUCCESS,
// };

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_REQUEST: {
      return {
        ...state,
        isLoggingIn: true,
        logInErrorReason: '',
      };
    }
    case LOG_IN_SUCCESS: {
      return {
        ...state,
        isLoggedIn: true,
        isLoggingIn: false,
        me: action.data,
      };
    }
    case LOG_IN_FAILURE: {
      return {
        ...state,
        isLoggingIn: false,
        logInErrorReason: action.error,
        me: null,
      };
    }
    case LOG_OUT_REQUEST: {
      return {
        ...state,
        isLoggingOut: true,
      };
    }
    case LOG_OUT_SUCCESS: {
      return {
        ...state,
        isLoggedIn: false,
        isLoggingOut: false,
        me: null,
      };
    }
    case LOG_OUT_FAILURE: {
      return {
        ...state,
        isLoggingOut: false,
        logOutErrorReason: action.error,
      };
    }
    case SIGN_UP_REQUEST: {
      return {
        ...state,
        signUpData: action.data,
        isSigningUp: true,
        signUpErrorReason: '',
      };
    }
    case SIGN_UP_SUCCESS: {
      return {
        ...state,
        signedUp: true,
        isSigningUp: false,
      };
    }
    case SIGN_UP_FAILURE: {
      return {
        ...state,
        signedUp: false,
        isSigningUp: false,
        signUpErrorReason: action.error,
      };
    }
    case LOAD_USER_REQUEST: {
      return {
        ...state,
      };
    }
    case LOAD_USER_SUCCESS: {
      if (action.me) {
        return {
          ...state,
          isLoggedIn: true,
          me: action.data,
        };
      }
      return {
        ...state,
        isLoggedIn: true,
        userInfo: action.data,
      };
    }
    case LOAD_USER_FAILURE: {
      return {
        ...state,
        loadErrorReason: action.error,
      };
    }
    case FOLLOW_USER_REQUEST: {
      return {
        ...state,
      };
    }
    case FOLLOW_USER_SUCCESS: {
      return {
        ...state,
        me: {
          ...state.me,
          Followings: [{ id: action.data }, ...state.me.Followings],
        },
      };
    }
    case FOLLOW_USER_FAILURE: {
      return {
        ...state,
        loadErrorReason: action.error,
      };
    }
    case UNFOLLOW_USER_REQUEST: {
      return {
        ...state,
      };
    }
    case UNFOLLOW_USER_SUCCESS: {
      return {
        ...state,
        followingList: state.followingList.filter(v => v.id != action.data),
        me: {
          ...state.me,
          Followings: state.me.Followings.filter(v => v.id !== action.data),
        },
      };
    }
    case UNFOLLOW_USER_FAILURE: {
      return {
        ...state,
        loadErrorReason: action.error,
      };
    }
    case ADD_POST_TO_ME: {
      return {
        ...state,
        me: {
          ...state.me,
          Posts: [{ id: action.data }, ...state.me.Posts],
        },
      };
    }
    case LOAD_FOLLOWINGS_REQUEST: {
      return {
        ...state,
      };
    }
    case LOAD_FOLLOWINGS_SUCCESS: {
      return {
        ...state,
        followingList: action.data,
      };
    }
    case LOAD_FOLLOWINGS_FAILURE: {
      return {
        ...state,
        loadFollowErrorReason: error,
      };
    }
    case LOAD_FOLLOWERS_REQUEST: {
      return {
        ...state,
      };
    }
    case LOAD_FOLLOWERS_SUCCESS: {
      return {
        ...state,
        followerList: action.data,
      };
    }
    case LOAD_FOLLOWERS_FAILURE: {
      return {
        ...state,
        loadFollowErrorReason: error,
      };
    }
    case REMOVE_FOLLOWER_REQUEST: {
      return {
        ...state,
      };
    }
    case REMOVE_FOLLOWER_SUCCESS: {
      return {
        ...state,
        followerList: state.followerList.filter(v => v.id !== action.data),
        me: {
          ...state.me,
          Followers: state.me.Followers.filter(v => v.id !== action.data),
        },
      };
    }
    case REMOVE_FOLLOWER_FAILURE: {
      return {
        ...state,
      };
    }
    case EDIT_USER_NICKNAME_REQUEST: {
      return {
        ...state,
        isEditingNickname: true,
      };
    }
    case EDIT_USER_NICKNAME_SUCCESS: {
      return {
        ...state,
        me: {
          ...state.me,
          nickname: action.data.nickname,
        },
        isEditingNickname: false,
      };
    }
    case EDIT_USER_NICKNAME_FAILURE: {
      return {
        ...state,
        isEditingNickname: false,
        editNicknameErrorReason: action.error,
      };
    }
    case REMOVE_POST_OF_ME: {
      return {
        ...state,
        me: {
          ...state.me,
          Posts: state.me.Posts.filter(v => v.id !== action.data.postId),
        },
      };
    }
    default:
      return {
        ...state,
      };
  }
};

export default reducer;
