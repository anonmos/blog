module.exports = function(env) {
  if (env) {
    return require(`./webpack.${env}.js`)
  }
}