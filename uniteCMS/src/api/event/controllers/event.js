'use strict';

/**
 * event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;


module.exports = createCoreController('api::event.event', 
  ({strapi}) => ({
    async getHomePackage(ctx) {
        // @ts-ignore
        const id = ctx.params.id
        const { query } = ctx

        let response = await strapi.entityService.findOne('plugin::users-permissions.user', 
          id, { populate: ['attending_events', 'hosted_events'] }
        )

        let events_feed = await strapi.entityService.findMany('api::event.event', 
          { 
            populate: ['event_host', 'participants'], 
            filters: {  
              $not: {
                  event_host: { id: id }
              }
            }
          })

        response = await { 
          username: response.username,
          attending_events: response.attending_events,
          hosted_events: response.hosted_events,
          events_feed: events_feed
        }

        return response
    } 
  })
);
