import produce from 'immer';

export const initialState = {
  mainPosts: [
    // {
    //   id: 1,
    //   User: {
    //     id: 1,
    //     nickname: '신주현',
    //   },
    //   content: 'dummyPost',
    //   img:
    //     'https://pbs.twimg.com/profile_images/876741994877304832/Y90mfYPD_400x400.jpg',
    //   Comments: [],
    //   Likers: [],
    // },
  ], // 화면에 포일 포스트들
  imagePaths: [], // 미리보기 이미지 경로
  addPostErrorReason: '', // 포스트 업로드 실패 사유
  isAddingPost: false, // 포스트 업로드 중
  postAdded: false, // 포스트 업로드 성공
  isAddingComment: false,
  addCommentErrorReason: '',
  commentAdded: false,
  loadPostsErrorReason: '',
  loadCommentsErrorReason: '',
  likePostErrorReason: '',
  isEditingPostContent: false,
  editPostContentErrorReason: '',
  hasMorePost: false,
  gotPosts: false,
};

// const dummyPost = {
//   User: {
//     id: 2,
//     nickname: '터미네이터',
//   },
//   content: '터미네이터 윌 비 백',
//   comments: [],
// };

// const dummyComment = {
//   User: {
//     id: 3,
//     nickname: '윤원경',
//   },
//   // createdAt: new Date(),
//   content: '더미 댓글',
//   id: 1,
// };

export const LOAD_MAIN_POSTS_REQUEST = 'LOAD_MAIN_POSTS_REQUEST';
export const LOAD_MAIN_POSTS_SUCCESS = 'LOAD_MAIN_POSTS_SUCCESS';
export const LOAD_MAIN_POSTS_FAILURE = 'LOAD_MAIN_POSTS_FAILURE';

export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const REMOVE_IMAGE = 'REMOVE_IMAGE';

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const LOAD_COMMENTS_REQUEST = 'LOAD_COMMENTS_REQUEST';
export const LOAD_COMMENTS_SUCCESS = 'LOAD_COMMENTS_SUCCESS';
export const LOAD_COMMENTS_FAILURE = 'LOAD_COMMENTS_FAILURE';

export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const EDIT_POST_REQUEST = 'EDIT_POST_REQUEST';
export const EDIT_POST_SUCCESS = 'EDIT_POST_SUCCESS';
export const EDIT_POST_FAILURE = 'EDIT_POST_FAILURE';

export const UNLOAD_MAINPOSTS = 'UNLOAD_MAINPOSTS';

// export const addPost = {
//   type: ADD_POST,
// };
// export const addDummy = {
//   type: ADD_DUMMY,
//   data: {
//     content: 'hello',
//     UserId: 1,
//     User: {
//       nickname: 'SJH',
//     },
//   },
// };

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ADD_POST_REQUEST: {
        (draft.isAddingPost = true), (draft.addPostErrorReason = '');
        draft.postAdded = false;
        break;
      }
      case ADD_POST_SUCCESS: {
        draft.isAddingPost = false;
        draft.mainPosts.unshift(action.data);
        draft.postAdded = true;
        draft.imagePaths = [];
        break;
      }
      case ADD_POST_FAILURE: {
        return {
          ...state,
          isAddingPost: false,
          addPostErrorReason: action.error,
        };
      }
      case LOAD_COMMENTS_REQUEST: {
        return {
          ...state,
        };
      }
      case LOAD_COMMENTS_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(
          (v) => v.id === action.data.postId,
        );
        draft.mainPosts[postIndex].Comments = action.data.comments;
        break;
      }
      case LOAD_COMMENTS_FAILURE: {
        return {
          ...state,
          loadCommentsErrorReason: action.error,
        };
      }
      case ADD_COMMENT_REQUEST: {
        return {
          ...state,
          isAddingComment: true,
          addCommentErrorReason: '',
          commentAdded: false,
        };
      }
      case ADD_COMMENT_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(
          (v) => v.id === action.data.postId,
        );
        draft.mainPosts[postIndex].Comments.push(actio.data.comment);
        draft.isAddingComment = false;
        draft.commentAdded = true;
        break;
      }
      case ADD_COMMENT_FAILURE: {
        return {
          ...state,
          isAddingComment: false,
          addCommentErrorReason: action.error,
        };
      }

      case LOAD_MAIN_POSTS_REQUEST:
      case LOAD_HASHTAG_POSTS_REQUEST:
      case LOAD_USER_POSTS_REQUEST: {
        return {
          ...state,
          mainPosts: action.lastId === 0 ? [] : state.mainPosts,
          hasMorePost: action.lastId ? state.hasMorePost : true,
        };
      }
      case LOAD_MAIN_POSTS_SUCCESS:
      case LOAD_HASHTAG_POSTS_SUCCESS:
      case LOAD_USER_POSTS_SUCCESS: {
        return {
          ...state,
          mainPosts: state.mainPosts.concat(action.data),
          hasMorePost: action.data.length === 10,
          gotPosts: true,
        };
      }
      case LOAD_MAIN_POSTS_FAILURE:
      case LOAD_HASHTAG_POSTS_FAILURE:
      case LOAD_USER_POSTS_FAILURE: {
        return {
          ...state,
          loadPostsErrorReason: action.error,
        };
      }
      case UPLOAD_IMAGES_REQUEST: {
        return {
          ...state,
        };
      }
      case UPLOAD_IMAGES_SUCCESS: {
        return {
          ...state,
          imagePaths: [...state.imagePaths, ...action.data], // 이미지 미리보기 경로들
        };
      }
      case UPLOAD_IMAGES_FAILURE: {
        return {
          ...state,
        };
      }
      case REMOVE_IMAGE: {
        return {
          ...state,
          imagePaths: state.imagePaths.filter((v, i) => i !== action.index),
        };
      }
      case LIKE_POST_REQUEST: {
        return {
          ...state,
        };
      }
      case LIKE_POST_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(
          (v) => v.id === action.data.postId,
        );
        draft.mainPosts[postIndex].Likers.unshift({ id: action.data.userId });
        break;
      }
      case LIKE_POST_FAILURE: {
        return {
          ...state,
          likePostErrorReason: action.error,
        };
      }
      case UNLIKE_POST_REQUEST: {
        return {
          ...state,
        };
      }
      case UNLIKE_POST_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(
          (v) => v.id === action.data.postId,
        );
        const likeIndex = draft.mainPosts[postIndex].Likers.findIndex(
          (v) => v.id === action.data.userId,
        );
        draft.mainPosts[postIndex].Likers.splice(likeIndex, 1);
        break;
      }
      case UNLIKE_POST_FAILURE: {
        return {
          ...state,
        };
      }
      case RETWEET_REQUEST: {
        return {
          ...state,
        };
      }
      case RETWEET_SUCCESS: {
        return {
          ...state,
          mainPosts: [action.data, ...state.mainPosts],
        };
      }
      case RETWEET_FAILURE: {
        return {
          ...state,
        };
      }
      case REMOVE_POST_REQUEST: {
        return {
          ...state,
        };
      }
      case REMOVE_POST_SUCCESS: {
        return {
          ...state,
          mainPosts: state.mainPosts.filter(
            (v) =>
              v.id !== action.data.postId && v.RetweetId !== action.data.postId,
          ),
        };
      }
      case REMOVE_POST_FAILURE: {
        return {
          ...state,
        };
      }
      case EDIT_POST_REQUEST: {
        return {
          ...state,
          isEditingPostContent: true,
          editedPostContent: false,
        };
      }
      case EDIT_POST_SUCCESS: {
        const postIndex = state.mainPosts.findIndex(
          (v) => v.id === action.data.postId,
        );
        draft.mainPosts[postIndex].content = action.data.editPostContent;
        draft.isEditingPostContent = false;
        draft.editedPostContent = true;
        break;
      }
      case EDIT_POST_FAILURE: {
        return {
          ...state,
          editPostContentErrorReason: action.error,
          isEditingPostContent: false,
        };
      }
      case UNLOAD_MAINPOSTS: {
        return {
          ...state,
          mainPosts: [],
          gotPosts: false,
        };
      }
      default:
        return { ...state };
    }
  });
};

export default reducer;
