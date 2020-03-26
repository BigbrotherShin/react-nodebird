import React, { useEffect } from 'react';
import { Menu, Input, Button, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import Link from 'next/link';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import { useSelector, useDispatch } from 'react-redux';
import { LOAD_USER_REQUEST } from '../reducers/user';

const AppLayout = ({ children }) => {
  const { me, isLoggedIn } = useSelector(state => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoggedIn) {
      dispatch({
        type: LOAD_USER_REQUEST,
      });
    }
  }, []);

  return (
    <div>
      <Menu mode='horizontal'>
        <Menu.Item key='home'>
          <Link href='/'>
            <a>노드버드</a>
          </Link>
        </Menu.Item>
        {me ? (
          <Menu.Item key='profile'>
            <Link href='/profile'>
              <a>프로필</a>
            </Link>
          </Menu.Item>
        ) : null}
        <Menu.Item key='mail'>
          <Input.Search style={{ verticalAlign: 'middle' }} enterButton />
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <Link href='https://velog.io/@bigbrothershin'>
            <a target='_blank'>Made By BigbroShin</a>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node,
};

export default AppLayout;
