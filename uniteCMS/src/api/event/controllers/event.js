// 'use strict';

// /**
//  * event controller
//  */

// const { createCoreController } = require('@strapi/strapi').factories;


// module.exports = createCoreController('api::event.event', 
//   ({strapi}) => ({
//     async getHomePackage(ctx) {
//       const id = ctx.params.id
//       const { query } = ctx

//       async function fetchUserEvents(id) {
//         const SERVICE = 'plugin::users-permissions.user'
//         const PARAMS = { populate: ['attending_events', 'hosted_events'] }

//         return strapi.entityService.findOne(SERVICE, id, PARAMS)
//       }

//       async function fetchEventsFeed(id) {
//         const SERVICE = 'api::event.event'
//         const FILTERS = {  
//           $not: {
//               event_host: { id: id }
//           }}
        
//         const PARAMS = { 
//           populate: ['event_host', 'participants'], 
//           filters: FILTERS
//         }

//         const events_feed = await strapi.entityService.findMany(SERVICE, PARAMS)

//         return events_feed
//       }

//       // const retrieveAll = async () => {

//         // await Promise.all([
//         //       fetchUserEvents(id).then((response) => {
//         //         const { username, attending_events, hosted_events } = response
//         //         return { username, attending_events, hosted_events }
//         //       }),
//         //       fetchEventsFeed(id),
//         //     ])
//         //   }

//       const { username, attending_events, hosted_events } = await fetchUserEvents(id)

//       return {
//         username: await username,
//         attending_events: await attending_events,
//         hosted_events: await hosted_events,
//         events_feed: await fetchEventsFeed()
//       }
//     } 
//   })
// );



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

      async function fetchUserEvents(id) {
        const SERVICE = 'plugin::users-permissions.user'
        const PARAMS = { populate: ['attending_events', 'hosted_events'] }

        return strapi.entityService.findOne(SERVICE, id, PARAMS)
      }

      async function fetchEventsFeed(id) {
        const SERVICE = 'api::event.event'
        const FILTERS = {  
          $not: {
              event_host: { id: id }
          }}
        
        const PARAMS = { 
          populate: ['event_host', 'participants'], 
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
            events_feed: eventsFeed}
      })
      
      return homePackage
    } 
  })
);
