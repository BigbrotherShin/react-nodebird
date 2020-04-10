const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = withBundleAnalyzer({
  distDir: '.next',
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../../bundles/server.html',
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html',
    },
  },
  webpack(config) {
    const prod = process.env.MODE_ENV !== 'development';
    return {
      ...config,
      mode: prod ? 'production' : 'development',
      devtool: prod ? 'hidden-source-map' : 'eval', // 소스코드 숨기면서 에러 시 소스맵 제공 : 빠르게 웹팩 적용
      plugins: [
        ...config.plugins,
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ko/),
        prod && new CompressionPlugin(), // 배포일 때만 CompressionPlugin 사용. main.js -> main.js.gz 용량을 1/3로 줄여줌
      ], // 서버는 .gz 파일을 보내고, 브라우저는 그 파일 압축을 해제하여 사용
    };
  },
});
