const { errors } = require("@strapi/utils");
const { ApplicationError } = require("@strapi/utils/dist/errors");
const { findAllUsers } = require("./server/controllers/find");
const { befriend } = require("./server/controllers/friends");

module.exports = (plugin) => {
  plugin.controllers.user.find = findAllUsers,

  plugin.controllers.user.befriend = befriend,

  plugin.routes['content-api'].routes.push({
    method: 'GET',
    path: '/befriend/:friend_user_id',
    handler: 'user.befriend'
  }) 

  return plugin;
}