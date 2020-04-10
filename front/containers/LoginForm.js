import React, { useCallback, memo, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
import { useInput } from '../pages/signup';
import { useDispatch, useSelector } from 'react-redux';
import { LOG_IN_REQUEST } from '../reducers/user';

const LoginError = styled.div`
  color: red;
`;

const LoginForm = memo(() => {
  const [id, , onChangeId] = useInput('');
  const [password, , onChangePassword] = useInput('');
  const { isLoggingIn, logInErrorReason } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onSubmitForm = useCallback(() => {
    // 자식 컴포넌트(LoginForm 컴포넌트에서는 Form, Input 등이 자식컴포넌트)
    // 넘겨주는 함수는 무조건 useCallback으로 감싸준다.
    dispatch({
      type: LOG_IN_REQUEST,
      data: {
        userId: id,
        password,
      },
    });
  }, [id, password]);

  return (
    <Form style={{ padding: '10px' }} onFinish={onSubmitForm}>
      <div>
        <label htmlFor='user-id'>아이디</label>
        <br />
        <Input name='user-id' value={id} onChange={onChangeId} required />
      </div>
      <div>
        <label htmlFor='user-password'>비밀번호</label>
        <br />
        <Input.Password
          name='user-password'
          value={password}
          onChange={onChangePassword}
          required
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <Button type='primary' htmlType='submit' loading={isLoggingIn}>
          로그인
        </Button>
        <Link href='/signup'>
          <a>회원가입</a>
        </Link>
      </div>
      {logInErrorReason ? <LoginError>{logInErrorReason}</LoginError> : null}
    </Form>
  );
});

export default LoginForm;
