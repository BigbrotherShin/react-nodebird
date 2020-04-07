import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { Indicator, StyledImg } from './styles/ImagesZoomStyle';

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div>
      <div>
        <div>
          <Slider
            afterChange={(index) => setCurrentSlide(index)}
            dots={true}
            infinite={true}
          >
            {images.map((v, i) => {
              return (
                <div>
                  <StyledImg alt='v' src={`http://localhost:3065/${v.src}`} />
                </div>
              );
            })}
          </Slider>
          <Indicator>
            <div>
              {currentSlide + 1} / {images.length}
            </div>
          </Indicator>
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
