import React from 'react';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { StyledImgWrapper } from './styles/ImagesZoomStyle';

const ImagesZoom = ({ images }) => {
  return (
    <div>
      <div>
        <div>
          <Slider dots={true} infinite={true}>
            {images.map((v, i) => {
              return (
                <StyledImgWrapper>
                  <img alt='v' src={v.src} />
                </StyledImgWrapper>
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
