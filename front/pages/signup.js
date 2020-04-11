import React, { useState, useCallback, memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Checkbox, Button } from 'antd';
import Router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { SIGN_UP_REQUEST } from '../reducers/user';

const SignUpError = styled.div`
  color: red;
`;

const TextInput = memo(({ name, value, onChange }) => {
  return <Input name={name} value={value} required onChange={onChange} />;
}); // Input 컴포넌트가 antd에서 온 것이기 때문에 바로 memo를 적용할 수 없다.
// 최적화를 하기 위해서는 위의 경우처럼 따로 자식컴포넌트를 만들어서 해야하는데, 이것은 지나친 최적화다. 굳이 이렇께 까지 최적화를 하지 않아도 된다.

TextInput.propTypes = {
  value: PropTypes.string,
};

// Custom Hooks
export const useInput = (initValue = null) => {
  const [value, setter] = useState(initValue);
  const eventHandler = useCallback(
    (e) => {
      setter(e.target.value);
    },
    [value],
  );
  return [value, setter, eventHandler];
};

const Signup = () => {
  const { isSigningUp, signedUp, me } = useSelector((state) => state.user);

  const [passwordCheck, setPasswordCheck] = useState('');
  const [term, setTerm] = useState(false);
  const [passwordError, setPasswordError] = useState(true);
  const [termError, setTermError] = useState(false);

  const [id, setId, onChangeId] = useInput('');
  const [nick, setNick, onChangeNick] = useInput('');
  const [password, setPassword, onChangePassword] = useInput('');

  useEffect(() => {
    if (me) {
      alert('로그인되어 메인페이지로 이동합니다.');
      Router.push('/'); // id가 생기면 signup 페이지에서 메인 페이지로 이동
    }
  }, [me && me.id]);

  useEffect(() => {
    if (signedUp) {
      alert('회원가입에 성공하셨습니다! 로그인 해주세요.');
      Router.push('/');
    }
  }, [signedUp]);

  const dispatch = useDispatch();

  const onFinish = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    dispatch({
      type: SIGN_UP_REQUEST,
      data: {
        userId: id,
        password,
        nickname: nick,
      },
    });
  }, [password, passwordCheck, term, id, nick]);

  useEffect(() => {
    // if (!signedUp) return;
    setId('');
    setPasswordCheck('');
    setPassword('');
    setNick('');
    setTerm(false);
  }, [signedUp === true]);

  const onChangePasswordChk = useCallback(
    (e) => {
      setPasswordError(e.target.value !== password);
      setPasswordCheck(e.target.value);
    },
    [password],
  );

  const onChangeTerm = useCallback(
    (e) => {
      if (!term) setTermError(false);
      setTerm(e.target.checked);
    },
    [term],
  );

  if (me) {
    return null;
  }

  return (
    <Form onFinish={onFinish} style={{ padding: 10 }}>
      <div>
        <label htmlFor='user-id'>아이디</label>
        <br />
        <TextInput name='user-id' value={id} onChange={onChangeId} />
      </div>

      <div>
        <label htmlFor='user-nick'>닉네임</label>
        <br />
        <TextInput name='user-nick' value={nick} onChange={onChangeNick} />
      </div>

      <div>
        <label htmlFor='user-password'>비밀번호</label>
        <Input.Password
          name='user-password'
          value={password}
          required
          onChange={onChangePassword}
        />
      </div>

      <div>
        <label htmlFor='user-password-chk'>비밀번호 확인</label>
        <Input.Password
          name='user-password-chk'
          value={passwordCheck}
          onChange={onChangePasswordChk}
        />
        {password && passwordError && (
          <SignUpError>비밀번호가 일치하지 않습니다.</SignUpError>
        )}
      </div>

      <div>
        <Checkbox name='user-term' checked={term} onChange={onChangeTerm}>
          약관 동의
        </Checkbox>
        {termError && <SignUpError>약관에 동의하셔야 합니다.</SignUpError>}
      </div>

      <div style={{ marginTop: '10px' }}>
        <Button type='primary' htmlType='submit' loading={isSigningUp}>
          가입하기
        </Button>
      </div>
    </Form>
  );
};

export default Signup;
