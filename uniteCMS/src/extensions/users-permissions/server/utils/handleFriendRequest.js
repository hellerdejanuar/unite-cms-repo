const { confirm_friend_request, getFriendshipData, isMutual, isRequestAlreadySent, send_friend_request } = require("./utils");

// ## MAIN FUNCTIONS
const handleFriendRequest = async (user_id, friend_id) => {

  const userData = await getFriendshipData(user_id);

  // #  friend part of the frienship process  #
  if (!userData) {
    throw new Error('Error fetching User ( Uncommon Behavior )');
  }

  let response = null;

  if (isMutual(userData, friend_id)) {
    // If the requested friend is already in incoming_friend_request 
    console.debug('isMutual == true');
    response = await confirm_friend_request(user_id, friend_id);
    if (!response) throw new Error('Confirm friend request failed');

    return 'confirmed'

  } else if (isRequestAlreadySent(userData, friend_id)) {
    // Friend request already sent
    console.debug('isRequestAlreadySent == true');
    throw new Error('Friendship request already sent');

  } else {
    // Else, try to send a friend request

    console.debug('isMutual && isRequestAlreadySent == false');

    try { 
      response = await send_friend_request(user_id, friend_id);
      if (!response) throw new Error('Send friend request failed');
      
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
