'use strict';

/**
 * event controller
 */
const { createCoreController } = require('@strapi/strapi').factories;

const { sanitize } = require('@strapi/utils');
const { contentAPI } = sanitize;


// # TIP: to list all available cotrollers 
// run: $ yarn strapi controllers:list
async function fetchPersonalEvents(id, ctx) {
  const USERS_PERMISSIONS_SERVICE = 'plugin::users-permissions.user'
  const PARAMS = { populate: ['attending_events', 'hosted_events', 'image'] }// TODO: pedir related imagenes de hosted y attending 

  const contentType = strapi.contentType(USERS_PERMISSIONS_SERVICE)
  const PersonalEvents_unclean = strapi.entityService.findOne(USERS_PERMISSIONS_SERVICE, id, PARAMS)
  const PersonalEvents_sanitized = await contentAPI.output(PersonalEvents_unclean, contentType, ctx.state.auth);

  return PersonalEvents_unclean // <--- TODO: Clean this data
}


async function fetchEventsFeed(id, ctx) {
  const SERVICE = 'api::event.event'
  const FILTERS = {  
    $not: {
        event_host: { id: id }
    }}
  
  const PARAMS = { 
    populate: ['event_host', 'participants', 'image'], 
    filters: FILTERS
  }

  const EventsFeed_unclean = await strapi.entityService.findMany(SERVICE, PARAMS)
  const contentType = strapi.contentType(SERVICE)
  const EventsFeed_sanitized = await contentAPI.output(EventsFeed_unclean, contentType, ctx.state.auth);
  
  return EventsFeed_sanitized
}

module.exports = createCoreController('api::event.event', 
  ({strapi}) => ({
    async getHomePackage(ctx) {

      const id = ctx.params.id
      const authUser = ctx.state.user; // <- jwt 

      if (!authUser) {
        return ctx.unauthorized();
      } else if (authUser.id != id) {
        return ctx.unauthorized();
      }

      // ## Main function ---> 
      const HomePackage = await Promise.all([fetchPersonalEvents(id, ctx), fetchEventsFeed(id, ctx)])
        .then(([ userData, eventsFeed ]) => {
          // Process PersonalEvents & Feed Data
          return { 
            username: userData.username || "" ,
            attending_events: userData.attending_events || [],
            hosted_events: userData.hosted_events || [],
            events_feed: eventsFeed || []
          }
      }).catch((err) => {
        console.log( 'Error at: homePackage' + err )
      })
      
      return HomePackage
    } 
  })
);
