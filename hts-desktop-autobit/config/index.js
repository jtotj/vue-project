// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false,
    // devtool: 'source-map',
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8081,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target: 'https://trade.autobit.biz/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
          secure: false
        },
        onProxyReq(proxyReq, req, res) {
            proxyReq.setHeader('X-Forwarded-Host', 'trade.autobit.biz');
            proxyReq.setHeader('Host', 'trade.autobit.biz');
        },
        onProxyRes(proxyRes) {
            for (const key in proxyRes.headers['set-cookie']) {
                const cookie = proxyRes.headers['set-cookie'][key];

                proxyRes.headers['set-cookie'][key] = cookie.replace(/\.autobit\.biz/ig, 'localhost');
            }
        },
      },
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
