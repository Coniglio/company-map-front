module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    performance: {
      hints: false,
    },
    output: {
      filename: '[name].[hash].js',
    },
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    hot: true,
    public: '0.0.0.0:8080',
    disableHostCheck: true,
  },  
}
