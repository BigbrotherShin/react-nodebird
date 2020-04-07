import styled from 'styled-components';

export const StyledImg = styled.img`
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

export const Indicator = styled.div`
  text-align: center;
  & > div {
    width: 75px;
    height: 30px;
    line-height: 30px;
    display: inline-block;
    font-size: 15px;
  }
`;
