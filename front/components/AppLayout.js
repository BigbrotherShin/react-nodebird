import React, { useEffect, useRef, useCallback } from 'react';
import { Menu, Input, Button, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import Link from 'next/link';
import LoginForm from '../containers/LoginForm';
import UserProfile from '../containers/UserProfile';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Router from 'next/router';

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);

  const StyledSearch = styled(Input.Search)`
    vertical-align: middle;
  `;

  const onSearch = useCallback((value) => {
    Router.push(
      { pathname: '/hashtag', query: { tag: value } },
      `/hashtag/${value}`,
    );
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
            <Link
              href={{ pathname: '/profile', query: { id: me.id } }}
              as={`/profile/${me.id}`}
            >
              <a>프로필</a>
            </Link>
          </Menu.Item>
        ) : null}
        <Menu.Item key='mail'>
          <StyledSearch enterButton onSearch={onSearch} />
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
