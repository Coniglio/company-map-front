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
  configureWebpack: {
    output: {
      filename: '[name].[hash].js',
    },
  }
  
}
