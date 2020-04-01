import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import ImagesZoom from './ImagesZoom';
import Modal from 'react-modal';

const customStyles = {
  top: '50%',
  left: '50%',
  right: 'auto',
  bottom: 'auto',
  marginRight: '-50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  alignItem: 'center',
};

Modal.setAppElement('#__next');

const PostImages = ({ images }) => {
  const [showImagesZoom, setShowImagesZoom] = useState(false);

  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, [showImagesZoom]);

  const onClose = useCallback(() => {
    setShowImagesZoom(false);
  }, [showImagesZoom]);

  if (images.length === 1) {
    return (
      <>
        <img src={`http://localhost:3065/${images[0].src}`} onClick={onZoom} />
        <Modal
          isOpen={showImagesZoom}
          onRequestClose={onClose}
          style={{ ...customStyles }}
          contentLabel='Example Modal'
        >
          <ImagesZoom images={images} onClose={onClose} />
        </Modal>
        )}
      </>
    );
  }
  if (images.length === 2) {
    return (
      <>
        <div>
          <img
            src={`http://localhost:3065/${images[0].src}`}
            width='50%'
            onClick={onZoom}
          />
          <img
            src={`http://localhost:3065/${images[1].src}`}
            width='50%'
            onClick={onZoom}
          />
        </div>
        {showImagesZoom && (
          <Modal
            isOpen={showImagesZoom}
            onRequestClose={onClose}
            style={{ ...customStyles }}
            contentLabel='Example Modal'
          >
            <ImagesZoom images={images} onClose={onClose} />
          </Modal>
        )}
      </>
    );
  }
  return (
    <>
      <div>
        <img
          src={`http://localhost:3065/${images[0].src}`}
          width='50%'
          onClick={onZoom}
        />
        <div
          style={{
            display: 'inline-block',
            width: '50%',
            textAlign: 'center',
            verticalAlign: 'center',
          }}
          onClick={onZoom}
        >
          <PlusOutlined />
          <br />
          {images.length - 1}
          개의 사진 더 보기
        </div>
      </div>
      {showImagesZoom && (
        <Modal
          isOpen={showImagesZoom}
          onRequestClose={onClose}
          style={{ ...customStyles }}
          contentLabel='Example Modal'
        >
          <ImagesZoom images={images} onClose={onClose} />
        </Modal>
      )}
    </>
  );
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string,
    }),
  ).isRequired,
};

export default PostImages;
