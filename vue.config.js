module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    performance: {
      hints: false,
    }
  },
  devServer: {
    host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
  },
  outputDir: {
    filename: '[name].[hash].js',
  },
}
