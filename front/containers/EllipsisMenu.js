import React, { memo, useCallback, useState } from 'react';
import EditModal from './EditModal';
import { Menu } from 'antd';
import { REMOVE_POST_REQUEST } from '../reducers/post';

const EllipsisMenu = memo(({ post }) => {
  const [postEditVisible, setPostEditVisible] = useState(false);

  const onPostEditVisible = useCallback(() => {
    setPostEditVisible((prevState) => !prevState);
  }, []);

  const onPostDelete = useCallback(() => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, [post.id]);

  return (
    <Menu>
      <Menu.Item key='0' onClick={onPostEditVisible}>
        수정
      </Menu.Item>
      <EditModal
        postEditVisible={postEditVisible}
        setPostEditVisible={setPostEditVisible}
        post={post}
      />
      <Menu.Item key='1' onClick={onPostDelete}>
        삭제
      </Menu.Item>
    </Menu>
  );
});

export default EllipsisMenu;
