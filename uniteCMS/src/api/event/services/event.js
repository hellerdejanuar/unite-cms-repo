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

    const POPULATE = {
      attending_events: {
        populate: STD_POPULATE_EVENT,
        fields: STD_EVENT_FIELDS,
      },
      hosted_events: {
        populate: STD_POPULATE_EVENT,
        fields: STD_EVENT_FIELDS,
      },
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
      },
    };

    const PARAMS = {
      populate: STD_POPULATE_EVENT,
      fields: STD_EVENT_FIELDS,
      filters: EVENT_FEED_FILTERS,
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
    const HomePackage = await Promise.all([
      // @ts-ignore
      strapi.service("api::event.event").fetchPersonalEvents(id, ctx),
      // @ts-ignore
      strapi.service("api::event.event").fetchEventsFeed(id, ctx),
    ])
      .then(([userData, eventsFeed]) => {
        // Process PersonalEvents & Feed Data
        return {
          username: userData.username || "",
          attending_events: userData.attending_events || [],
          hosted_events: userData.hosted_events || [],
          events_feed: eventsFeed || [],
        };
      })
      .catch((err) => {
        console.log("Error at: homePackage" + err);
      });

    return HomePackage;
  },
}));
