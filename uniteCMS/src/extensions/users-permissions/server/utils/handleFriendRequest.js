const { ApplicationError } = require("@strapi/utils/dist/errors");
const { confirm_friend_request, getFriendshipData, isAlreadyFriend ,isMutual, isRequestAlreadySent, send_friend_request } = require("./utils");

// ## MAIN FUNCTIONS
const handleFriendRequest = async (user_id, friend_id) => {

  const userData = await getFriendshipData(user_id, friend_id);

  // #  friend part of the frienship process  #
  if (!userData) {
    throw new ApplicationError('Error fetching User ( Uncommon Behavior )');
  }

  if (isAlreadyFriend(userData, friend_id)) {
    throw new ApplicationError('You are already friends with this user');
  }

  let response = null;

  if (isMutual(userData, friend_id)) {
    // If the requested friend is already in incoming_friend_request 
    console.debug('isMutual == true');
    response = await confirm_friend_request(user_id, friend_id);
    if (!response) throw new ApplicationError('Confirm friend request failed');

    return 'confirmed'

  } else if (isRequestAlreadySent(userData, friend_id)) {
    // Friend request already sent
    console.debug('isRequestAlreadySent == true');
    throw new ApplicationError('Friendship request already sent');

  } else {
    // Else, try to send a friend request

    console.debug('isMutual && isRequestAlreadySent == false');

    try { 
      response = await send_friend_request(user_id, friend_id);
      if (!response) throw new ApplicationError('Send friend request failed');
      
      return 'sent'

    } catch (err) {
      // Send friend request failed

      const message = (err.name == 'ValidationError') 
      ? 'No User was found with this ID' 
      : `\'${err.name}\'`;

      throw new Error(
        'Could Not Send Friend Request. ' + message
      )
    }
  }


};

exports.handleFriendRequest = handleFriendRequest;
