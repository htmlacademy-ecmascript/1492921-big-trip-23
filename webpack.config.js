const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js', // Точка входа
  output: {
    filename: 'bundle.[contenthash].js', // Имя бандла
    path: path.resolve(__dirname, 'build'), // Директория для файлов сборки
    clean: true, // Удаляем предыдущую сборку перед созданием новой
  },
  devtool: 'source-map', // Генерируем карту исходного кода
  resolve: {
    alias: {
      "@view": path.resolve(__dirname, 'src/view/'),
      "@utils": path.resolve(__dirname, 'src/utils/'),
      "@presenter": path.resolve(__dirname, 'src/presenter/'),
      "@model": path.resolve(__dirname, 'src/model/')
    },
  },
  plugins: [ // Подключаем плагины
    new HtmlPlugin({
      template: 'public/index.html',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
  ],
  module: {
    rules: [ // Добавляем лоадеры
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
        },
      },
    ],
  },
};
