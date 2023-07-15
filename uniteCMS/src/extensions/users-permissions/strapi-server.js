module.exports = (plugin) => {
  plugin.controllers.user.find = (ctx) => {
    console.log('test strapi-server');
  }
  return plugin;
}