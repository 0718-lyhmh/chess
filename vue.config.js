module.exports = {
  devServer:{
    proxy:{
      '^/chess':{
        target:'http://localhost:5000',
        pathRewrite:{
          '^/chess':'/chess/'
        },
      }
    }
  }
};