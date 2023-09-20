"use strict";

/**
 * event service
 */

const { sanitize } = require("@strapi/utils");
const { contentAPI } = sanitize;
const { createCoreService } = require("@strapi/strapi").factories;

const {
  STD_EVENT_FIELDS,
  STD_FRIEND_FIELDS,
} = require("../config/event_params");
const { ApplicationError, NotFoundError, UnauthorizedError } = require("@strapi/utils/dist/errors");

module.exports = createCoreService("api::event.event", ({ strapi }) => ({

  async fetchPersonalEvents(id, ctx) {
    const USERS_PERMISSIONS_SERVICE = "plugin::users-permissions.user";

    const PARAMS = {
      populate: {
        attending_events: STD_EVENT_FIELDS,
        hosted_events: STD_EVENT_FIELDS,
        friends: STD_FRIEND_FIELDS  
      }
    };

    const contentType = strapi.contentType(USERS_PERMISSIONS_SERVICE);
    const PersonalEvents_unclean = strapi.entityService.findOne(
      USERS_PERMISSIONS_SERVICE,
      id,
      PARAMS
    );
    // @ts-ignore
    const PersonalEvents_sanitized = await contentAPI.output(
      PersonalEvents_unclean,
      contentType,
      ctx.state.auth
    );

    return PersonalEvents_unclean; // <--- TODO: Sanitize !! this data
  },



  async getHomePackage(ctx) {
    const id = ctx.params.id;
    const authUser = ctx.state.user; // <- jwt

    if (!authUser) {
      return ctx.unauthorized();
    } else if (authUser.id != id) {
      return ctx.unauthorized();
    }

    // ## Main function --->
    const HomePackage = await strapi.service("api::event.event").fetchPersonalEvents(id, ctx).then((userData) => {
        // Process PersonalEvents & Feed Data
        
        let events_feed = userData.friends.reduce((accum, friend) => accum.concat(friend.hosted_events), [])

        return {
          username: userData.username || "",
          attending_events: userData.attending_events || [],
          hosted_events: userData.hosted_events || [],
          events_feed: events_feed || [],
        };
      })
      .catch((err) => {
        console.log("Error at: homePackage: " + err);
      });

    return HomePackage;
  },
  
  async join(ctx) {
    const action = 'join'
    const action_target = 'event'

    const user_id = ctx.state.user.id
    const event_id = ctx.params.event_id
    
    const failLog = `user: ${user_id} could not perform < ${action} > on ${action_target}: ${event_id}`;
    let successLog = `user: ${user_id} < ${action} > successful on ${action_target}: ${event_id}`
    const maxedLog = 'The event is now at max capacity'

    try {
      const event = await strapi.entityService.findOne(
        'api::event.event', 
        event_id, 
        { populate: 
          { participants: { fields: ['id'] },
            event_host: { fields: ['id'] }
          }
        }
      )

      let dataToUpdate = {}

      if (!event) { throw new NotFoundError() }

      // # Check for Already Joined
      if (event.participants.find( participant => participant.id === user_id)){
        throw new UnauthorizedError('You are already joined')
      }

      if (event.event_host.id == user_id) {
        throw new UnauthorizedError('You are host of this event')
      }

      // # Check for capacity
      if (event.max_people != 0) { // if max_people 0 == no people limit
        console.debug('has people limit')

        if (event.is_full) {
          throw new UnauthorizedError('This event is full')

        } else if (event.participants.length + 1 >= event.max_people) {
          console.info('User MAXED OUT this events capacity')
          successLog = successLog + '\n' + maxedLog

          dataToUpdate['is_full'] = true
        }
      }

      dataToUpdate['participants'] = { connect : [ user_id ] }

      console.log(dataToUpdate)
      const response = await strapi.entityService.update(
        'api::event.event', 
        event_id, 
        { data: dataToUpdate },
      )
      
      if (!response) { 
        throw new NotFoundError(
          failLog + `. Could not update [${action_target}]` )
      }

      console.log(successLog)
      return successLog

    } catch (err) {
      throw err
    }
  },

  async unjoin(ctx) {
    const action = 'unjoin'
    const action_target = 'event'

    const user_id = ctx.state.user.id
    const event_id = ctx.params.event_id

    const successLog = `user: ${user_id} < ${action} > successful on ${action_target}: ${event_id}`
    const failLog = `user: ${user_id} could not perform < ${action} > on "${action_target}": ${event_id}`;

    try {
      const response = await strapi.entityService.update(
        'api::event.event', 
        event_id, 
        { data: { 
          attending_events: { disconnect : [ user_id ] } 
        }}
      )

      // TODO: Check if you are a participant of that event
      
      if (!response) {
        throw new Error(failLog + `. [${action_target} not found]`)
      }

      console.log(successLog)
      return successLog


    } catch (err) {
      console.log(err)
      console.log(failLog)
      return failLog
    }
  },

}));
