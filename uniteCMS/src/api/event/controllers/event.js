'use strict';

const { HttpStatusCode } = require('axios');

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
      const user_id = ctx.state.user

      request["event_host"] = { connect : [ user_id ] }

      ctx.request.body.data = JSON.stringify(request)
      // @ts-ignore
      const response = await super.create(ctx);
      return response
    },

    async join(ctx) {
      const user_id = ctx.state.user.id
      const event_id = ctx.params.event_id

      console.log(user_id)

      const response = await strapi.entityService.update(
        'plugin::users-permissions.user', 
        user_id, 
        { data: { 
            attending_events: { connect : [ event_id ] } 
        }}
      )

      return `successfully joined event: ${event_id}`
    },

    async unjoin(ctx) {
      const user_id = ctx.state.user.id
      const event_id = ctx.params.event_id

      console.log(user_id)

      const response = await strapi.entityService.update(
        'plugin::users-permissions.user', 
        user_id, 
        { data: { 
            attending_events: { disconnect : [ event_id ] } 
        }}
      )

      return `successfully unjoined event: ${event_id}`
    },

  })
);
