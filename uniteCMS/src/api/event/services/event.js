"use strict";

/**
 * event service
 */

const { sanitize } = require("@strapi/utils");
const { contentAPI } = sanitize;
const { createCoreService } = require("@strapi/strapi").factories;

const {
  STD_POPULATE_EVENT,
  STD_EVENT_FIELDS,
} = require("../config/event_params");

module.exports = createCoreService("api::event.event", ({ strapi }) => ({
  async fetchPersonalEvents(id, ctx) {
    const USERS_PERMISSIONS_SERVICE = "plugin::users-permissions.user";

    const FRIEND_FIELDS = {
      populate: {
        profile_image: {
          fields: ['formats']
        },
        hosted_events: {
          populate: STD_POPULATE_EVENT,
          fields: STD_EVENT_FIELDS
        },
      },
      fields: [
        'id',
        'username',
      ]
    }

    const POPULATE = {
      attending_events: {
        populate: STD_POPULATE_EVENT,
        fields: STD_EVENT_FIELDS,
      },
      hosted_events: {
        populate: STD_POPULATE_EVENT,
        fields: STD_EVENT_FIELDS,
      },
      friends: {
        populate: { 
          friend_info: FRIEND_FIELDS
        }
      }
    };

    const PARAMS = {
      populate: POPULATE,
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

  async fetchEventsFeed(id, ctx) {
    const SERVICE = "api::event.event";

    const EVENT_FEED_FILTERS = {
      $not: {
        event_host: { id: id },
        // add joined events to be excluded in this feed
      },
    };

    const PARAMS = {
      populate: STD_POPULATE_EVENT,
      fields: STD_EVENT_FIELDS,
      //filters: EVENT_FEED_FILTERS,
    };

    const EventsFeed_unclean = await strapi.entityService.findMany(
      SERVICE,
      PARAMS
    );

    const contentType = strapi.contentType(SERVICE);
    const EventsFeed_sanitized = await contentAPI.output(
      EventsFeed_unclean,
      contentType,
      ctx.state.auth
    );

    return EventsFeed_sanitized;
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

        let events_feed = userData.friends.reduce((accum, friend) => accum.concat(friend.friend_info.hosted_events), [])

        return {
          username: userData.username || "",
          attending_events: userData.attending_events || [],
          hosted_events: userData.hosted_events || [],
          events_feed: events_feed || [],
        };
      })
      .catch((err) => {
        console.log("Error at: homePackage" + err);
      });

    return HomePackage;
  },
  
  async join(ctx) {
    const action = 'join'
    const action_target = 'event'

    const user_id = ctx.state.user.id
    const event_id = ctx.params.event_id
    
    const failLog = `user: ${user_id} could not perform < ${action} > on ${action_target}: ${event_id}`;
    const successLog = `user: ${user_id} < ${action} > successful on ${action_target}: ${event_id}`

    try {
      const response = await strapi.entityService.update(
        'api::event.event', 
        event_id, 
        { data: { 
            participants: { connect : [ user_id ] } 
        }},
        
      )
      
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
