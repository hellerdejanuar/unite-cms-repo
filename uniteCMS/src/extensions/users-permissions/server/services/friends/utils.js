

module.exports = ({

  // # Utils
  isMutual (userData, friend_id) {
    if (!userData.incoming_friend_requests[0]) return false;

    if (userData.incoming_friend_requests[0].id == friend_id) { // Redundant since SQL filtering
      console.info('They already sent you a request, trying to connect... ');
      return true;
    } else {
      return false;
    }
  },

  isAlreadyFriend (userData, friend_id) {
    if (!userData.friends[0]){
      // console.info('Not friends yet, trying to connect... ');
      return false
    }

    if (userData.friends[0].id == friend_id && userData.friends.length == 1) {
      console.info('You are already friends')
      return true
      
    } else {
      console.info('Not friends yet, trying to connect... ');
      return false 
    }
  },

  isRequestAlreadySent (userData, friend_id) {
    try {
      if (!userData.pending_friend_requests[0]) return false

      if (userData.pending_friend_requests[0].id == friend_id){ // Redundant since SQL filtering
        console.info('Friendship request already sent')
        return true
      } 
      else return false

    } catch (err) {
      console.error('No entries in < pending_friend_requests >' + err.message)
    }
  }
})


