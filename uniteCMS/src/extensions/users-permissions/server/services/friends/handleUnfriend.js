const { ApplicationError, NotFoundError, UnauthorizedError } = require('@strapi/utils/dist/errors');
const { getFriendshipData, send_friend_request, confirm_friend_request, delete_friend, cancel_friend_request } = require('./friendshipOperators') 
const { isAlreadyFriend, isRequestAlreadySent, isInIncomingRequests } = require('./utils')


module.exports = ({   
  async handleUnfriend (user_id, friend_id) {
    try { 
    const userData = await getFriendshipData(user_id, friend_id);

    // #  friend part of the frienship process  #
    if (!userData) {
      throw new NotFoundError('Error fetching User ( Uncommon Behavior )');
    }

    let response
    let message = ''

    if (isAlreadyFriend(userData, friend_id)) {
      response = await delete_friend(user_id, friend_id)
      message = 'successfuly removed from friends list'
    }

    if (isInIncomingRequests(userData, friend_id)) {

      response = await cancel_friend_request(friend_id, user_id)
      message = 'request declined'

    } else if (isRequestAlreadySent(userData, friend_id)) {
      // if (friend request already sent) => cancel request
      response = await cancel_friend_request(user_id, friend_id)
      message = 'Friend request canceled'
    } 

    if (response != undefined && response != null) 
      { throw new ApplicationError('Removing friendship failed', {code: 500}) } // not sure if this ever happens
    
    return message

    } catch (err) {
      // console.debug('isMutual && isRequestAlreadySent == false')
      throw err
    }
  },
})