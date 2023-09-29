const { errors } = require("@strapi/utils");
const { ApplicationError } = require("@strapi/utils/dist/errors");
const { findAllUsers } = require("./server/controllers/find");
const { befriend, batchBefriend, unfriend } = require("./server/controllers/friends");

module.exports = (plugin) => {
  plugin.controllers.user.find = findAllUsers,

  plugin.controllers.user.befriend = befriend,

  plugin.controllers.user.unfriend = unfriend,

  plugin.controllers.user.batchBefriend = batchBefriend

  plugin.routes['content-api'].routes.push({
    method: 'POST',
    path: '/befriend/:friend_user_id',
    handler: 'user.befriend'
  })

  plugin.routes['content-api'].routes.push({
    method: 'POST',
    path: '/batch/befriend',
    handler: 'user.batchBefriend'
  })

  plugin.routes['content-api'].routes.push({
    method: 'DELETE',
    path: '/befriend/:friend_user_id',
    handler: 'user.unfriend'
  });


  return plugin;
}