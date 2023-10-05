const { errors } = require("@strapi/utils");
const { ApplicationError } = require("@strapi/utils/dist/errors");
const { findAllUsers } = require("./server/controllers/find");
const { befriend, batchBefriend, unfriend } = require("./server/controllers/friends");
const { deleteNewFriendsNotification } = require("./server/controllers/notifications/deleteNewFriends");

module.exports = (plugin) => {
  plugin.controllers.user.find = findAllUsers,
  plugin.controllers.user.befriend = befriend,
  plugin.controllers.user.batchBefriend = batchBefriend,
  plugin.controllers.user.unfriend = unfriend,
  plugin.controllers.user.deleteNewFriendsNotification = deleteNewFriendsNotification

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

  plugin.routes['content-api'].routes.push({
    method: 'PUT',
    path: '/notifications/del/new_friends',
    handler: 'user.deleteNewFriendsNotification'
  });


  return plugin;
}