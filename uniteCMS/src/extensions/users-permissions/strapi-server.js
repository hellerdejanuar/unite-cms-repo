module.exports = (plugin) => {
  plugin.controllers.user.find = (ctx) => {
    console.log('test strapi-server');
  }

  plugin.controllers.user.befriend = async (ctx) => {
    const action = 'befriend'
    const action_target = 'user'

    const user_id = ctx.state.user.id
    const friend_id = ctx.params.friend_user_id
    
    const failLog = `user: ${user_id} could not perform < ${action} > on ${action_target}: ${friend_id}`;
    const successLog = `user: ${user_id} < ${action} > successful on ${action_target}: ${friend_id}`

    try {
      // # friend part of the frienship process
      const response_friend = await strapi.entityService.update(
        'plugin::users-permissions.user', 
        friend_id, 
        { data: { 
            friends: { connect : [ user_id ] },
            // pending_friend_requests: { disconnect: [ user_id ]}
          }
        }
      )

      if (!response_friend) {
        throw new Error(failLog + `. [${action_target} not found]`)
      }

      // # user part of the frienship process
      const response_user = await strapi.entityService.update(
        'plugin::users-permissions.user', 
        user_id, 
        { data: { 
            friends: { connect : [ friend_id ] },
            // pending_friend_requests: { disconnect: [ friend_id ]}
          }
        }
      )
      console.log(successLog)

      if (!response_user) {
        throw new Error(failLog + `. [${action_target} not found]`)
      }

      
      return successLog

    } catch (err) {
      console.log(err)
      console.log(failLog)
      return failLog
    }
  },


  plugin.routes['content-api'].routes.push({
    method: 'GET',
    path: '/befriend/:friend_user_id',
    handler: 'user.befriend'
  }) 

  return plugin;
}