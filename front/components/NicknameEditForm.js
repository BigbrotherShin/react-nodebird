import React from 'react';
import { Form, Input, Button } from 'antd';

const NicknameEditForm = ({ dummyProfile }) => {
  return (
    <Form
      style={{
        marginBottom: '20px',
        border: '1px solid #d9d9d9',
        padding: '20px',
      }}
    >
      <Input addonBefore='닉네임' value={dummyProfile.name} />
      <Button type='primary'>수정</Button>
    </Form>
  );
};

export default NicknameEditForm;
