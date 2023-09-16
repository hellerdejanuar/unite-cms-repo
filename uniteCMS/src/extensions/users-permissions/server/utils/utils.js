// # Parameter generation for strapi database handling
const connect_disconnect_params = (relation_connect, connect, relation_disconnect, disconnect) => {

  if (typeof connect === 'string') {
    connect = parseInt(connect);
  }
  if (typeof disconnect === 'string') {
    disconnect = parseInt(disconnect);
  }
  const data = {};

  data[relation_connect] = { connect: [connect] };
  if (relation_disconnect) {
    data[relation_disconnect] = { disconnect: [disconnect] };
  }

  const obj = { data };

  return obj;
};

// # Services
const getFriendshipData = async (user_id, friend_id) => {
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
};

const send_friend_request = async (user_id, friend_id) => {
  return await strapi.entityService.update(
    'plugin::users-permissions.user',
    user_id,
    connect_disconnect_params('pending_friend_requests', friend_id) 
    // this connection automatically creates related incoming_friend_requests in the target friend
  );
};

const confirm_friend_request = async (user_id, friend_id) => {
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
    const revert_friendship = await strapi.entityService.update( // revert friend to previous state
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
};

// # Utils
const isMutual = (userData, friend_id) => {
  if (!userData.incoming_friend_requests[0]) return false;

  if (userData.incoming_friend_requests[0].id == friend_id) { // Redundant since SQL filtering
    console.info('They already sent you a request, trying to connect... ');
    return true;
  } else {
    return false;
  }
};

const isAlreadyFriend = (userData, friend_id) => {
  if (!userData.friends[0]){
    console.info('Not friends yet, trying to connect... ');
    return false
  }

  if (userData.friends[0].id == friend_id && userData.friends.length == 1) {
    console.info('You are already friends')
    return true
    
  } else {
    console.info('Not friends yet, trying to connect... ');
    return false 
  }
}

const isRequestAlreadySent = (userData, friend_id) => {
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
};

exports.isAlreadyFriend = isAlreadyFriend;
exports.confirm_friend_request = confirm_friend_request;
exports.connect_disconnect_params = connect_disconnect_params;
exports.getFriendshipData = getFriendshipData;
exports.isMutual = isMutual;
exports.isRequestAlreadySent = isRequestAlreadySent;
exports.send_friend_request = send_friend_request;
