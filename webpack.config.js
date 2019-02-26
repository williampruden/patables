'use strict'
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env) => {
  console.log('WEBPACK ENV:', env)

  // VARIABLES
  const isProduction = env === 'production'
  const isDev = env === 'development'

  // PLUGGINS
  // cleans 'dist' folder everytime before a new build
  const CleanPLugin = new CleanWebpackPlugin(['dist'], {
    root: __dirname,
    verbose: true,
    dry: false
  })

  const CopyPlugin = new CopyWebpackPlugin([{
    from: 'index.js',
    to: '.'
  }])

  // BUILDING WEBPACK
  const config = {}

  config.entry = ['@babel/polyfill', './src/app.js']

  config.optimization = {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'initial'
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          ecma: 8,
          mangle: false,
          keep_classnames: true,
          keep_fnames: true
        }
      })
    ]
  }

  config.plugins = [CleanPLugin, CopyPlugin]

  config.module = {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }

  config.resolve = {
    extensions: ['.js']
  }

  if (isProduction) {
    config.output = {
      path: path.join(__dirname, './dist'),
      publicPath: '/',
      chunkFilename: '[name].js',
      filename: '[name].js'
    }
    config.mode = 'production'
    config.devtool = 'source-map'
  }

  if (isDev) {
    config.output = {
      path: path.join(__dirname, 'dist'),
      chunkFilename: '[name].js',
      filename: '[name].js'
    }

    config.mode = 'development'
    config.devtool = 'inline-source-map'
  }

  return config
}
