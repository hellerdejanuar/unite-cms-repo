'use strict';

const { ApplicationError } = require('@strapi/utils/dist/errors');

/**
 * event controller
 */
const { createCoreController } = require('@strapi/strapi').factories;


module.exports = createCoreController('api::event.event', 
  ({strapi}) => ({
    // ## getHomePackage --------------------------------------
    async getHomePackage(ctx) {
      try {
        return await strapi.service('api::event.event').getHomePackage(ctx)
      } catch (err) {
        ctx.body = err
      }
    },

    async create(ctx) {
      try {
        const userId = ctx.state.user

        let requestBody = ctx.request.body
        const DATA_TO_APPEND = { event_host : { connect : [ userId ] } }

        switch (ctx.request.header['content-type'].split(';')[0]) {
          case 'multipart/form-data':
            console.log("Multipart/Form-Data")

            requestBody.data = JSON.parse(requestBody.data)
            requestBody.data = { ...requestBody.data, DATA_TO_APPEND }
            requestBody.data = JSON.stringify(requestBody.data)
            break;
        
          case 'application/json':
            console.log("Application/JSON")
            requestBody.data = { ...requestBody.data, DATA_TO_APPEND }
            break;
            
          default:
            break;
        }

        ctx.request.body = requestBody
        
        // @ts-ignore
        const response = await super.create(ctx);
        return response
      
        
      } catch (err) {
        console.log(err)
        return ctx.badRequest('cannot handle request', { request: `${ctx.request.body}`})
      }

    },

  // ### JOIN, UNJOIN -----------------------------------------
    async join(ctx) {
      const action = 'join'
      const target = 'event'

      const user_id = ctx.state.user.id
      const event_id = ctx.params.event_id
      
      const failLog = `user: ${user_id} could not perform < ${action} > on ${target}: ${event_id}`;
      const successLog = `user: ${user_id} < ${action} > successful on event: ${event_id}`

      try {
        const response = await strapi.entityService.update(
          'plugin::users-permissions.user', 
          user_id, 
          { data: { 
              attending_events: { connect : [ event_id ] } 
          }}
        )

        console.log(successLog)
        
        return successLog

      } catch (err) {
        console.log(err)
        console.log(failLog)
        return failLog
      }
    },

    async altjoin(ctx) {
      const action = 'altjoin'
      const target = 'event'

      const user_id = ctx.state.user.id
      const event_id = ctx.params.event_id
      
      const failLog = `user: ${user_id} could not perform < ${action} > on ${target}: ${event_id}`;
      const successLog = `user: ${user_id} < ${action} > successful on event: ${event_id}`

      try {
        const response = await strapi.entityService.update(
          'plugin::users-permissions.user', 
          user_id, 
          { data: { 
              attending_events: { connect : [ event_id ] } 
          }}
        )

        console.log(successLog)
        
        return successLog

      } catch (err) {
        console.log(err)
        console.log(failLog)
        return failLog
      }
    },

    async unjoin(ctx) {
      const action = 'unjoin'
      const target = 'event'

      const user_id = ctx.state.user.id
      const event_id = ctx.params.event_id

      const successLog = `user: ${user_id} < ${action} > successful on event: ${event_id}`
      const failLog = `user: ${user_id} could not perform < ${action} > on "${target}": ${event_id}`;

      try {
        const response = await strapi.entityService.update(
          'plugin::users-permissions.user', 
          user_id, 
          { data: { 
            attending_events: { disconnect : [ event_id ] } 
          }}
        )

        console.log(successLog)
        return successLog
      } catch (err) {
        console.log(err)
        console.log(failLog)
        return failLog
      }
    },

  })
);
