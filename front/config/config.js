const backUrl =
  process.env.NODE_ENV === 'production'
    ? 'http://api.bigbroshin.net'
    : 'http://localhost:3065';

export { backUrl };
