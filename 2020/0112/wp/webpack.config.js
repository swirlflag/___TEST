module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins : [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ],
  modules : {
      rules : [
        {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        }
      ]
  }
};