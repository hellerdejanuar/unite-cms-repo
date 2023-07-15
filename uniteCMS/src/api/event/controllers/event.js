'use strict';

/**
 * event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::event.event', 
  ({strapi}) => ({
    async getHomePackage(ctx) {
        // @ts-ignore
        const { id } = ctx.params;
        const { query } = ctx
        
        return await strapi.entityService.findOne(
          'plugin::users-permissions.user',
          id,
          { 
            populate: ['attending_events', 'hosted_events']
          }
        )
    } 
  })
);
