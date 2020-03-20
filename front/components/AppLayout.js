import React from 'react';
import { Menu, Input, Button, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import Link from 'next/link';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import { useSelector } from 'react-redux';

const AppLayout = ({ children }) => {
  const { isLoggedIn } = useSelector(state => state.user);

  return (
    <div>
      <Menu mode='horizontal'>
        <Menu.Item key='home'>
          <Link href='/'>
            <a>노드버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item key='profile'>
          <Link href='/profile'>
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item key='mail'>
          <Input.Search style={{ verticalAlign: 'middle' }} enterButton />
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {isLoggedIn ? <UserProfile /> : <LoginForm />}
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
