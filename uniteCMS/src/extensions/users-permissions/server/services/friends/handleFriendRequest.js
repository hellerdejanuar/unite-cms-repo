const { ApplicationError, NotFoundError, UnauthorizedError } = require('@strapi/utils').errors;
const { getFriendshipData, send_friend_request, confirm_friend_request } = require('./friendshipOperators') 
const { isAlreadyFriend, isRequestAlreadySent, isInIncomingRequests } = require('./utils')


module.exports = ({   
  async handleFriendRequest (user_id, friend_id) {

    const userData = await getFriendshipData(user_id, friend_id);

    // #  friend part of the frienship process  #
    if (!userData) {
      throw new NotFoundError('Error fetching User ( Uncommon Behavior )');
    }

    if (isAlreadyFriend(userData, friend_id)) {
      throw new UnauthorizedError('Already Friends', {code: 304});
    }

    let response = null;

    if (isInIncomingRequests(userData, friend_id)) {
      // If the requested friend is already in incoming_friend_request 
      console.debug('isInIncomingRequests == true');

      response = await confirm_friend_request(user_id, friend_id);
      if (!response) throw new ApplicationError('Confirm friend request failed', {code: 500});

      return 'confirmed'

    } else if (isRequestAlreadySent(userData, friend_id)) {
      // Friend request already sent
      console.debug('isRequestAlreadySent == true');
      throw new UnauthorizedError('Friendship request already sent', {code: 409});
    } 

    // Else, try to send a friend request
    try { 
      response = await send_friend_request(user_id, friend_id);
      return 'sent'

    } catch (err) {
      console.debug('isInIncomingRequests && isRequestAlreadySent == false')
      throw new NotFoundError('Send friend request failed', {code: 404}) // not sure if this ever happens
    }
  },
})