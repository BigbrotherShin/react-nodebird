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

export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

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
  switch (action.type) {
    case ADD_POST_REQUEST: {
      return {
        ...state,
        isAddingPost: true,
        addPostErrorReason: '',
        postAdded: false,
      };
    }
    case ADD_POST_SUCCESS: {
      return {
        ...state,
        isAddingPost: false,
        mainPosts: [action.data, ...state.mainPosts],
        postAdded: true,
        imagePaths: [],
      };
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
      const postIndex = state.mainPosts.findIndex(
        v => v.id === action.data.postId,
      );
      const post = state.mainPosts[postIndex];
      const comments = action.data.comments;
      // console.log(comments);
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, comments };
      // console.log(mainPosts);
      return {
        ...state,
        mainPosts,
      };
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
      const postIndex = state.mainPosts.findIndex(
        v => v.id === action.data.postId,
      );
      const post = state.mainPosts[postIndex];
      const comments = [...post.comments, action.data.comment];
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, comments };
      return {
        ...state,
        mainPosts,
        isAddingComment: false,
        commentAdded: true,
      };
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
      };
    }
    case LOAD_MAIN_POSTS_SUCCESS:
    case LOAD_HASHTAG_POSTS_SUCCESS:
    case LOAD_USER_POSTS_SUCCESS: {
      return {
        ...state,
        mainPosts: action.data,
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
      const postIndex = state.mainPosts.findIndex(
        v => v.id === action.data.postId,
      );
      const post = state.mainPosts[postIndex];
      const Likers = [{ id: action.data.userId }, ...post.Likers];
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Likers };
      return {
        ...state,
        mainPosts,
      };
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
      const postIndex = state.mainPosts.findIndex(
        v => v.id === action.data.postId,
      );
      const post = state.mainPosts[postIndex];
      const Likers = post.Likers.filter((v, i) => v.id !== action.data.userId);
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Likers };
      return {
        ...state,
        mainPosts,
      };
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
          v =>
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
        v => v.id === action.data.postId,
      );
      const post = state.mainPosts[postIndex];
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = {
        ...post,
        content: action.data.editPostContent,
      };
      return {
        ...state,
        mainPosts,
        isEditingPostContent: false,
        editedPostContent: true,
      };
    }
    case EDIT_POST_FAILURE: {
      return {
        ...state,
        editPostContentErrorReason: action.error,
        isEditingPostContent: false,
      };
    }
    default:
      return { ...state };
  }
};

export default reducer;
