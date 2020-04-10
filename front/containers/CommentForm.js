import React, { memo, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button } from 'antd';
import PropTypes from 'prop-types';
import { ADD_COMMENT_REQUEST } from '../reducers/post';

const CommentForm = memo(({ post }) => {
  const [commentText, setCommentText] = useState('');
  const { commentAdded, isAddingComment } = useSelector((state) => state.post);
  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (commentAdded) {
      setCommentText('');
    }
    // console.log('front/components/PostCard post: ', post);
  }, [commentAdded === true]);

  const onChangeCommentText = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);

  const onSubmitComment = useCallback(() => {
    if (!me) {
      return alert('로그인이 필요합니다.');
    }
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: {
        postId: post.id,
        content: commentText,
      },
    });
  }, [me && me.id, commentText]);

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item>
        <Input.TextArea
          rows={4}
          value={commentText}
          onChange={onChangeCommentText}
        />
      </Form.Item>
      <Button type='primary' htmlType='submit' loading={isAddingComment}>
        삐약
      </Button>
    </Form>
  );
});

CommentForm.protoTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
