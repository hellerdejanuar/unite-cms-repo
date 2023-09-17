const { errors } = require("@strapi/utils");
const { handleFriendRequest } = require("./server/utils/handleFriendRequest");
const { ApplicationError } = require("@strapi/utils/dist/errors");
// ## EXPORTS

module.exports = (plugin) => {
  plugin.controllers.user.find = async (ctx) => {
    const users = await strapi.entityService.findMany(
      "plugin::users-permissions.user",
      { fields: ['id', 'public_name', 'username'],
      populate: { profile_image: true} }
    );

    ctx.body = users;
  },


  plugin.controllers.user.befriend = async (ctx) => {
    const action = 'befriend'
    const action_target = 'user'

    const user_id = ctx.state.user.id
    const friend_id = ctx.params.friend_user_id

    const failLog = `user: ${user_id} could not perform < ${action} > on ${action_target}: ${friend_id}`;
    const successLog = `user: ${user_id} < ${action} > successful on ${action_target}: ${friend_id}`;
    let details = ''

    try {
      const friendship_response = await handleFriendRequest(user_id, friend_id)
      console.debug(friendship_response)
      
      if (!friendship_response) {
        details = `. [${action_target} not found]`
        throw new Error(`[ ${failLog} ] ${details}`)
      }

      details = `< Request ${friendship_response} >`
      return `[ ${successLog} ]\n${details}` 

    } catch (err) {
      console.error(err)
      throw new ApplicationError( `[ ${failLog} ]\n${err.message}`)
    }
  },

  plugin.routes['content-api'].routes.push({
    method: 'GET',
    path: '/befriend/:friend_user_id',
    handler: 'user.befriend'
  }) 

  return plugin;
}