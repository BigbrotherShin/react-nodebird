import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { CloseOutlined } from '@ant-design/icons';

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const imageStyle = {
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  };
  return (
    <div>
      <div>
        <h1>상세 이미지</h1>
        <CloseOutlined onClick={onClose} />
      </div>
      <div>
        <div>
          <Slider
            afterChange={index => setCurrentSlide(index)}
            dots={true}
            infinite={true}
          >
            {images.map((v, i) => {
              return (
                <div>
                  <img
                    style={{ ...imageStyle }}
                    alt='v'
                    src={`http://localhost:3065/${v.src}`}
                  />
                </div>
              );
            })}
          </Slider>
          <div>
            <div>
              {currentSlide + 1} / {images.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string,
    }),
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
