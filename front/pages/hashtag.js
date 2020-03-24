import React from 'react';

const Hashtag = () => {
  return <div>Hashtag</div>;
};

Hashtag.getInitialProps = async context => {
  console.log('Hashtag Context: ', context.query.tag);
};

export default Hashtag;
