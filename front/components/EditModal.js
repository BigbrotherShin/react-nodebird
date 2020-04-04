import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { EDIT_POST_REQUEST } from '../reducers/post';

const EditModal = ({ postEditVisible, setPostEditVisible, post }) => {
  const dispatch = useDispatch();
  const [editPostContent, setEditPostContent] = useState(post && post.content);
  const { editedPostContent, isEditingPostContent } = useSelector(
    state => state.post,
  );

  useEffect(() => {
    if (editedPostContent) {
      setPostEditVisible(prevState => !prevState);
    }
  }, [editedPostContent]);

  const handleCancle = useCallback(() => {
    setPostEditVisible(prevState => !prevState);
    setEditPostContent(post && post.content);
  }, []);

  const onChangeEditPostContent = useCallback(e => {
    setEditPostContent(e.target.value);
  }, []);

  const onPostEdit = useCallback(() => {
    dispatch({
      type: EDIT_POST_REQUEST,
      data: { editPostContent: editPostContent, postId: post.id },
    });
  }, [editPostContent]);

  return (
    <>
      <Modal
        title={`${post.User.nickname}님의 게시물 수정하기`}
        visible={postEditVisible}
        okText='수정하기'
        onOk={onPostEdit}
        confirmLoading={isEditingPostContent}
        onCancel={handleCancle}
      >
        <Input.TextArea
          value={editPostContent}
          onChange={onChangeEditPostContent}
        />
      </Modal>
    </>
  );
};

export default EditModal;
