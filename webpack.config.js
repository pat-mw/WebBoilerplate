const path = require('path')
const webpack = require('webpack')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

// const { ProvidePlugin } = require('webpack')
// const loader = require('sass-loader')

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev'

const dirApp = path.join(__dirname, 'app')
const dirShared = path.join(__dirname, 'shared')
const dirStyles = path.join(__dirname, 'styles')
const dirNode = path.join(__dirname, 'node_modules')

module.exports = {
  entry: [
    path.join(dirApp, 'index.js'),
    path.join(dirStyles, 'index.scss')
  ],

  resolve: {
    modules: [
      dirApp,
      dirShared,
      dirStyles,
      dirNode
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: './shared',
          to: ''
        }
      ]
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),

    new ImageMinimizerPlugin({
      minimizerOptions: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }]

          // SVG's will be optimised using another plugin (hence ommitted here)

          // [
          //   'svgo',
          //   {
          //     plugins: [
          //       {
          //         removeViewBox: false,
          //       },
          //     ],
          //   },
          // ],
        ]
      }
    }),

    // plug-in for automatically cleaning out the public folder
    new CleanWebpackPlugin()

  ],

  module: {
    rules: [
      // interpeting JS files
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      },

      // interpreting CSS files
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: ''
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false
            }
          }
        ]
      },

      // image minimizer plugin
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset',
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
            options: {
              severityError: 'warning', // Ignore errors on corrupted images
              minimizerOptions: {
                plugins: ['gifsicle', 'jpegtran', 'optipng']
              }
            }
          }
        ]
      },

      // webpack-copy module for IMAGES
      {
        test: /\.(jpe?g|png|gif|svg|webp)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'images/',
          name (file) {
            return '[hash].[ext]'
          }
        }
      },

      // webpack-copy module for FONTS
      {
        test: /\.(woff2?|fnt)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'fonts/',
          name (file) {
            return '[hash].[ext]'
          }
        }
      },

      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw-loader',
        exclude: /node_modules/
      },

      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/
      }
    ]
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
}
