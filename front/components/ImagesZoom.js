import React, { useState } from 'react';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { StyledImg } from './styles/ImagesZoomStyle';
import { backUrl } from '../config/config';

const ImagesZoom = ({ images }) => {
  const [setCurrentSlide] = useState(0);

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
                  <StyledImg alt='v' src={`${backUrl}/${v.src}`} />
                </div>
              );
            })}
          </Slider>
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
