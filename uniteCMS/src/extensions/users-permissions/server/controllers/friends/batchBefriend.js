const { ApplicationError, NotFoundError } = require("@strapi/utils").errors
const { handleFriendRequest } = require("../../services/friends/handleFriendRequest")

module.exports = {
  async batchBefriend (ctx) {
    const user_id = ctx.state.user.id
    const batch = ctx.request.body // SQL injection vulnerability <---

    const promises = batch.map( async (friend_id) => {
      try {
        const friendship_response = await handleFriendRequest(user_id, friend_id) // TODO: optimize handleFriendRequest to call own user data only once

        if (!friendship_response) {
          throw new ApplicationError('handleFriendRequest failed')
        }

        return 200 

      } catch (err) {

        // console.debug(err.details.code)
        switch (err.details.code) {
          case 304: 
            return 304 // Already friends, no changes
          case 403:
            return 403 // Unauthorized
          case 404:
            return 404 // Friend Not Found
          case 409: 
            return 409 // conflict (used for isRequestAlreadySent)
          default:
            return 500 // Application Error
        }
      }
    })

    return Promise.all(promises)
  }
}