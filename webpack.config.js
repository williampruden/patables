'use strict'
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = (env) => {
  console.log('WEBPACK ENV:', env)

  // VARIABLES
  const isProduction = env === 'production'
  const isDev = env === 'development'

  // PLUGGINS
  // minifying our CSS
  const CSSPlugin = new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css'
  })

  // cleans 'dist' folder everytime before a new build
  const CleanPLugin = new CleanWebpackPlugin(['dist'], {
    root: __dirname,
    verbose: true,
    dry: false
  })

  // BUILDING WEBPACK
  const config = {}

  config.entry = ['@babel/polyfill', './src/app.js']

  config.optimization = {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: { discardComments: { removeAll: true } }
      }),
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

  config.plugins = [CSSPlugin, CleanPLugin]

  config.module = {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
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
      filename: 'index.js'
    }
    config.mode = 'production'
    config.devtool = 'source-map'
  }

  if (isDev) {
    config.output = {
      path: path.join(__dirname, 'dist'),
      filename: 'index.js'
    }

    config.mode = 'development'
    config.devtool = 'inline-source-map'

    config.devServer = {
      contentBase: path.join(__dirname, 'dist'),
      historyApiFallback: true
    }
  }

  return config
}
