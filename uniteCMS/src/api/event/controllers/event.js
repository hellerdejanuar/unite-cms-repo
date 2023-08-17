'use strict';

/**
 * event controller
 */
const { createCoreController } = require('@strapi/strapi').factories;


module.exports = createCoreController('api::event.event', 
  ({strapi}) => ({
    async getHomePackage(ctx) {
      try {
        return await strapi.service('api::event.event').getHomePackage(ctx)
      } catch (err) {
        ctx.body = err
      }
    },

    async create(ctx) {
      let request = JSON.parse(ctx.request.body.data);

      request["event_host"] = { connect : [ctx.state.user] }

      ctx.request.body.data = JSON.stringify(request)
      // @ts-ignore
      const response = await super.create(ctx);
      return response
    }
  })
);
