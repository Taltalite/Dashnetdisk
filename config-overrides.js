const { override, addWebpackAlias } = require('customize-cra')
const path = require('path')

// module.exports = function override(config, env) {
//   // do stuff with the webpack config...
//   return config;
// };

module.exports = override(
  //配置路径别名
  addWebpackAlias({
    ['src']: path.resolve(__dirname, './src'),
    ['assets']: path.resolve(__dirname, './src/assets'),
    ['utils']: path.resolve(__dirname, './src/utils'),
    ['components']: path.resolve(__dirname, './src/components'),
    ['views']: path.resolve(__dirname, './src/views')
  })
)