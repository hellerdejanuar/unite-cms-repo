'use strict';

const { ApplicationError } = require('@strapi/utils/dist/errors');

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
      try {
        const user_id = ctx.state.user

        let request_body = ctx.request.body
        const event_host_connection = { connect : [ user_id ] }

        switch (ctx.request.header['content-type'].split(';')[0]) {
          case 'multipart/form-data':
            console.log("Multipart/Form-Data")

            request_body.data = JSON.parse(request_body.data)

            request_body.data["event_host"] = event_host_connection

            request_body.data = JSON.stringify(request_body.data)
            break;
        
          case 'application/json':
            console.log("Application/JSON")
            request_body.data["event_host"] = event_host_connection
            
          default:
            break;
        }

        ctx.request.body = request_body
        
        // @ts-ignore
        const response = await super.create(ctx);
        return response
      
        
      } catch (err) {
        console.log(err)
        return ctx.badRequest('cannot handle request', {request: `${ctx.request.body}`})
      }

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
