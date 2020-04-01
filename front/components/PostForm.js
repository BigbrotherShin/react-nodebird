import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  ADD_POST_REQUEST,
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE,
} from '../reducers/post';

const PostForm = () => {
  const dispatch = useDispatch();
  const { imagePaths, isAddingPost, postAdded } = useSelector(
    state => state.post,
  );
  const imageInput = useRef();
  const [text, setText] = useState('');

  const onChangeText = useCallback(
    e => {
      setText(e.target.value);
    },
    [text],
  );

  const onSubmitForm = useCallback(() => {
    if (!text || !text.trim()) {
      return alert('게시글은 한 글자 이상이어야 합니다.');
    }
    const formData = new FormData();
    imagePaths.forEach(i => {
      // router upload.array('image') middleware의 'image'와 이름이 같게
      // AJAX 통신시 'key(image)': 'value(f)' 형식으로 formData에 append해서 직접 보내주어야 함
      formData.append('image', i);
    });
    formData.append('content', text.trim());
    // console.log('front/components/PostForm: ', formData);
    dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
  }, [text, imagePaths]);

  useEffect(() => {
    setText('');
  }, [postAdded === true]);

  const onChangeImages = useCallback(e => {
    // console.log('Is this??', e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, f => {
      // router.post('/post/images/', multer.array('image'), (req, res, next) => {});
      return imageFormData.append('image', f); // router upload.array('image') middleware의 'image'와 이름이 같게
      // AJAX 통신시 'key(image)': 'value(f)' 형식으로 formData에 append해서 직접 보내주어야 함
    });
    // console.log('PostForm imageFromData: ', imageFormData);
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onRemoveImage = useCallback(
    index => () => {
      dispatch({
        type: REMOVE_IMAGE,
        index,
      });
    },
    [],
  );

  return (
    <Form
      style={{ margin: '10px 0 20px' }}
      encType='multipart/form-data' // 이미지, 파일, 사진 등 데이터를 보낼 때의 데이터 타입
      onFinish={onSubmitForm}
    >
      <Input.TextArea
        maxLength={140}
        placeholder='오늘은 무슨 일이 있으셨습니까?'
        style={{ marginBottom: '8px' }}
        value={text}
        onChange={onChangeText}
      />
      <div>
        <input
          type='file'
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button
          type='primary'
          style={{ float: 'right' }}
          htmlType='submit'
          loading={isAddingPost}
        >
          짹짹
        </Button>
      </div>
      <div>
        {imagePaths.map((v, i) => {
          return (
            <div key={v} style={{ display: 'inline-block' }}>
              <img
                src={`http://localhost:3065/${v}`}
                style={{ width: '200px' }}
                alt={v}
              />
              <div>
                <Button onClick={onRemoveImage(i)}>제거</Button>
              </div>
            </div>
          );
        })}
      </div>
    </Form>
  );
};

export default PostForm;
