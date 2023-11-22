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
const { ApplicationError, NotFoundError, UnauthorizedError } = require("@strapi/utils").errors;

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
  
  async join(ctx, dataToUpdate) {
  const user_id = ctx.state.user.id
  const event_id = ctx.params.event_id

    try {
      const response = await strapi.entityService.update(
        'api::event.event', 
        event_id, 
        { data: dataToUpdate },
      )
      
      if (!response) { 
        throw new NotFoundError('Could not update event')
      }

      return (`user < ${user_id} > successfully joined event < ${event_id} >`)

    } catch (err) {
      throw err
    }
  },

  async unjoin(ctx, dataToUpdate) {
    const user_id = ctx.state.user.id
    const event_id = ctx.params.event_id
    try {
      const response = await strapi.entityService.update(
        'api::event.event', 
        event_id, 
        { data: dataToUpdate}
      )

      if (!response) throw new NotFoundError()

      return (`user < ${user_id} > successfully unjoined event < ${event_id} >`)

    } catch (err) {
      throw err
    }
  },
  
}));
