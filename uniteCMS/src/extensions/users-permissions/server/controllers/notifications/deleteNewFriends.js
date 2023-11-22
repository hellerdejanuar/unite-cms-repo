const { ApplicationError } = require("@strapi/utils").errors

module.exports = {
  async deleteNewFriendsNotification (ctx) { 
    const user_id = ctx.state.user.id
    let batch = ctx.request.body

    if (!batch) throw new ApplicationError('handleFriendRequest failed')
    if (!(batch instanceof Array)) throw new ApplicationError('SQL error')

    const response = await strapi.entityService.update( // update friend
      'plugin::users-permissions.user',
      user_id,
      { data: { new_friends: { disconnect: batch } } }
    )
    
    if (!response) throw new ApplicationError('handleFriendRequest failed')

    return 200
  }
}