const { ApplicationError, NotFoundError } = require("@strapi/utils/dist/errors");
const { connect_disconnect_params } = require("../../utils");
const { isAlreadyFriend ,isInIncomingRequests, isRequestAlreadySent } = require("./utils");
const { disconnect_params } = require("../../utils/utils");


module.exports = ({ 

  async getFriendshipData (user_id, friend_id) {
    try {
      const user = await strapi.entityService.findOne(
        'plugin::users-permissions.user',
        user_id,
        { populate: {
            incoming_friend_requests: {
              fields: [ 'id' ],
              filters: { id: friend_id },
            },
            pending_friend_requests: {
              fields: ['id'],
              filters: { id: friend_id },
            },
            friends: {
              fields: ['id'],
              filters: { id: friend_id },
            }
          },
        }
      );
      return user

    } catch (err) {
      throw new Error(err);
    }
  },

  async send_friend_request (user_id, friend_id) {
    return await strapi.entityService.update(
      'plugin::users-permissions.user',
      user_id,
      connect_disconnect_params('pending_friend_requests', friend_id) 
      // this connection automatically creates related incoming_friend_requests in the target friend
    );
  },

  async confirm_friend_request (user_id, friend_id) {
    const function_name = 'confirm_friend_request'
    const errorLog = (details, isUpper=true) => `Error: < ${function_name} > Failed: ${ isUpper ? details.toUpperCase(): details}`


    const response_friend = await strapi.entityService.update( // update friend
      'plugin::users-permissions.user',
      friend_id,
      connect_disconnect_params('friends', user_id, 'pending_friend_requests', user_id)
      // * pending_friend_requests disconnection automatically affects related < incoming_friend_requests > *
    );

    if (!response_friend) throw new Error(errorLog('friend unavailable'))

    try {
      const response_user = await strapi.entityService.update( // update user
        'plugin::users-permissions.user',
        user_id,
        connect_disconnect_params('friends', friend_id)
        // * < incoming_friend_requests > disconnect not needed here *
      );

      if (!response_user) throw new Error(errorLog('user unavailable'))

      return true;

    } catch (err){
      const revert_friendship = await strapi.entityService.update( // revert friend to previous state if Failed to update
        'plugin::users-permissions.user',
        friend_id,
        connect_disconnect_params('pending_friend_requests', user_id, 'friends', user_id)
        // *  *
      );

      if (revert_friendship) {
        throw new Error(errorLog('Succesfully reverted friendship state', false)) }
      else {
        throw new Error(errorLog('WARNING: COULD NOT REVERT FRIENDSHIP TO PREVIOUS STATE')) }

    }
  },

  async delete_friend (user_id, friend_id) {
    try { 
      const response_user = await strapi.entityService.update(
        'plugin::users-permissions.user',
        user_id,
        disconnect_params('friends', friend_id)
      )
      if (!response_user) throw new ApplicationError('Delete Friend ERROR: Couldnt change OWN data', {code: 500})

      const response_friend = await strapi.entityService.update( // update friend
        'plugin::users-permissions.user',
        friend_id,
        disconnect_params('friends', user_id)
        // * pending_friend_requests disconnection automatically affects related < incoming_friend_requests > *
      )

      if (!response_friend) { 

        const revert_user = await strapi.entityService.update(
          'plugin::users-permissions.user',
          user_id,
          connect_disconnect_params('friends', friend_id)
        )

        if (!revert_user) {
          throw new ApplicationError('Delete Friend FATAL ERROR: Couldnt REVERT OWN data to original state. Database integrity compromised', {code: 500})
        }
  
        throw new ApplicationError('Delete Friend ERROR: Couldnt change FRIEND data', {code: 500})
      }

    } catch (err) {
      throw err
    }
  },

  async cancel_friend_request (user_id, friend_id) {
    try {
      const response = await strapi.entityService.update(
        'plugin::users-permissions.user',
        user_id,
        disconnect_params('pending_friend_requests', friend_id)
      )

      if (!response) throw new ApplicationError('Delete Friend ERROR: Couldnt cancel friend request', {code: 500})
    } catch (err){
      throw err
    }
  }
})