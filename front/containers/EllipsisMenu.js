import React, { memo, useCallback } from 'react';
import { Menu, Popconfirm } from 'antd';
import { REMOVE_POST_REQUEST } from '../reducers/post';
import { useDispatch } from 'react-redux';

const EllipsisMenu = memo(({ post, setPostEditVisible, showConfirm }) => {
  const dispatch = useDispatch();

  const onPostEditVisible = useCallback(() => {
    setPostEditVisible((prevState) => !prevState);
  }, []);

  // const onPostDelete = useCallback(() => {
  //   dispatch({
  //     type: REMOVE_POST_REQUEST,
  //     data: post.id,
  //   });
  // }, [post.id]);

  return (
    <>
      <Menu>
        <Menu.Item key='0' onClick={onPostEditVisible}>
          수정
        </Menu.Item>

        <Menu.Item key='1' onClick={showConfirm(post.id)}>
          {/* <Popconfirm
            placement='leftBottom'
            title='정말로 게시물을 삭제하시겠습니까?'
            onConfirm={onPostDelete}
            okText='Yes'
            cancelText='No'
          > */}
          삭제
          {/* </Popconfirm> */}
        </Menu.Item>
      </Menu>
    </>
  );
});

export default EllipsisMenu;
