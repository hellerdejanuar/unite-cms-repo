const { ApplicationError } = require("@strapi/utils").errors
const { handleUnfriend } = require("../../services/friends/handleUnfriend")


module.exports = {
  async unfriend (ctx) {
    const user_id = ctx.state.user.id
    const friend_id = ctx.params.friend_user_id

    try {
      const friendship_response = await handleUnfriend(user_id, friend_id)
      
      if (!friendship_response) throw new Error(`[ Could not cancel friendship ]`)
      
      return friendship_response 

    } catch (err) {
      const date = new Date(Date.now()).toUTCString()
      console.error(`${date} ${err.message}`)
      throw new ApplicationError(err.message)
    }
  }
}