'use strict';

/**
 * event controller
 */
const { createCoreController } = require('@strapi/strapi').factories;

const utils = require('@strapi/utils');
const { ReturnDocument } = require('mongodb');




module.exports = createCoreController('api::event.event', 
  ({strapi}) => ({
    async getHomePackage(ctx) {

      const id = ctx.params.id
      const authUser = ctx.state.user; // jwt 
      // const { query } = ctx;
      // const sanitizedQuery = await sanitizeQuery(query, ctx);
      // const user = await getService('user').fetch(authUser.id, sanitizedQuery);
      // ctx.body = await sanitizeOutput(user, ctx);

      if (!authUser) {
        return ctx.unauthorized();
      } else if (authUser.id != id) {
        return ctx.unauthorized();
      }

      async function fetchUserEvents(id) {
        const SERVICE = 'plugin::users-permissions.user'
        const PARAMS = { populate: ['attending_events', 'hosted_events', 'image'] }

        const entity = strapi.entityService.findOne(SERVICE, id, PARAMS)
        // const sanitizedResults = await this.sanitizeOutput(results, ctx);
        return entity
      }

      async function fetchEventsFeed(id) {
        const SERVICE = 'api::event.event'
        const FILTERS = {  
          $not: {
              event_host: { id: id }
          }}
        
        const PARAMS = { 
          populate: ['event_host', 'participants', 'image'], 
          filters: FILTERS
        }

        const events_feed = await strapi.entityService.findMany(SERVICE, PARAMS)

        return events_feed
      }

      const homePackage = await Promise.all([fetchUserEvents(id), fetchEventsFeed(id)])
        .then(([ userData, eventsFeed ]) => {
          // Process User & Feed Data
          return { username: userData.username,
            attending_events: userData.attending_events,
            hosted_events: userData.hosted_events,
            events_feed: eventsFeed }
      }).catch((err) =>{
        console.log('Error at: homePackage' + err)
      })
      
      return homePackage
    } 
  })
);
