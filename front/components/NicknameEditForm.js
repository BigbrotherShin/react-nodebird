import React, { useCallback, useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { EDIT_USER_NICKNAME_REQUEST } from '../reducers/user';

const NicknameEditForm = () => {
  const { me, isEditingNickname } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [text, setText] = useState(me && me.nickname);

  const onChangeNickname = useCallback(e => {
    setText(e.target.value);
  }, []);

  const onSubmitEditNickname = useCallback(() => {
    if (!text || !text.trim()) {
      return alert('닉네임은 한 글자 이상이어야 합니다.');
    }
    dispatch({
      type: EDIT_USER_NICKNAME_REQUEST,
      data: {
        nicknameText: text,
        id: me.id,
      },
    });
  }, [text, me && me.id]);

  return (
    <Form
      onFinish={onSubmitEditNickname}
      style={{
        marginBottom: '20px',
        border: '1px solid #d9d9d9',
        padding: '20px',
      }}
    >
      <Input addonBefore='닉네임' value={text} onChange={onChangeNickname} />
      <Button type='primary' htmlType='submit' loading={isEditingNickname}>
        수정
      </Button>
    </Form>
  );
};

export default NicknameEditForm;
