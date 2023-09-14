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

    // # Create Event (with automatic DATA_TO_APPEND)
    async create(ctx) {
      try {
        const userId = ctx.state.user.id

        let requestBody = ctx.request.body
        const DATA_TO_APPEND = { event_host : { connect : [ userId ] } }

        switch (ctx.request.header['content-type'].split(';')[0]) {
          case 'multipart/form-data':
            console.debug("Multipart/Form-Data")

            requestBody.data = JSON.parse(requestBody.data)
            requestBody.data = { ...requestBody.data, ...DATA_TO_APPEND }
            requestBody.data = JSON.stringify(requestBody.data)
            break;
        
          case 'application/json':
            console.debug("Application/JSON")
            requestBody.data = { ...requestBody.data, ...DATA_TO_APPEND }
            break;
            
          default:
            break;
        }

        ctx.request.body = requestBody
        
        // @ts-ignore
        const response = await super.create(ctx);
        return response
      
      } catch (err) {
        console.error(err)
        return ctx.badRequest('cannot handle request: service error', { request: `${ctx.request.body}`})
      }

    },

  // ### JOIN, UNJOIN -----------------------------------------
    async join(ctx) {
      try {
        return await strapi.service('api::event.event').join(ctx)
      } catch (err) {
        console.log(err)
        return ctx.badRequest('cannot handle request: service error', { request: `${ctx.request.body}`})
      }
    },

    async unjoin(ctx) {
      try {
        return await strapi.service('api::event.event').unjoin(ctx)
      } catch (err) {
        console.log(err)
        return ctx.badRequest('cannot handle request: service error', { request: `${ctx.request.body}`})
      }
    },

  })
);
