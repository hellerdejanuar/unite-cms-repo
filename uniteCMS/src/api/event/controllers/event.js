'use strict';

const { ApplicationError, NotFoundError, UnauthorizedError } = require('@strapi/utils').errors;

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
        throw err
      }
    },


    // # Create Event (with automatic DATA_TO_APPEND) ---------
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
        throw new Error('cannot handle request: service error\n' + ctx.request.body)
      }

    },


  // ### JOIN, UNJOIN -----------------------------------------
    async join(ctx) {
      try {
        const user_id = ctx.state.user.id
        const event_id = ctx.params.event_id

        const event = await strapi.entityService.findOne(
          'api::event.event', 
          event_id, 
          { populate: 
            { participants: { fields: ['id'] },
              event_host: { fields: ['id'] }
            }
          }
        )

        let dataToUpdate = {}
        let details = ''

        // check if event exists
        if (!event) { throw new NotFoundError() } 

        // if user !event_host
        if (event.event_host.id == user_id) { 
          throw new UnauthorizedError('You are host of this event')
        }

        // # Check for Already Joined
        if (event.participants.find( participant => participant.id === user_id)){
          throw new UnauthorizedError('You are already joined')
        }

        // # Check for capacity
        if (event.max_people != 0) { // if max_people is 0 == no people limit

          if ( event.is_full ) {
            throw new UnauthorizedError('This event is full')

          } else if ( event.participants.length + 1 >= event.max_people ) {
            dataToUpdate['is_full'] = true
            details = '\nThis event is now full'
          }
        }

        dataToUpdate['participants'] = { connect : [ user_id ] }

        console.log(dataToUpdate)
        const response = await strapi.service('api::event.event').join(ctx, dataToUpdate)

        if (!response) throw new ApplicationError('Couldn\'t update event')

        return response + details

      } catch (err) {
        throw err
      }
    },

    async unjoin(ctx) {
      try {

        const user_id = ctx.state.user.id
        const event_id = ctx.params.event_id

        const event = await strapi.entityService.findOne(
          'api::event.event', 
          event_id, 
          { populate: 
            { participants: { fields: ['id'] },
              event_host: { fields: ['id'] }
            }
          }
        )

        let dataToUpdate = {}

        if (!event) { throw new NotFoundError() }

        if (event.event_host.id == user_id) {
          throw new UnauthorizedError('You are host of this event')
        }

        // # Check for Already Joined
        if (!event.participants.find( participant => participant.id === user_id)){
          throw new UnauthorizedError('You are not joined to this event')
        }

        // # Update capacity status
        if ( event.is_full ) {
          dataToUpdate['is_full'] = false
        } 

        dataToUpdate['participants'] = { disconnect : [ user_id ] }

        const response = await strapi.service('api::event.event').unjoin(ctx, dataToUpdate)
        return response
      } catch (err) {
        throw err
      }
    },
    async count(ctx) {
      var { query } = ctx.request 
      return strapi.query('api::event.event').count({where: query})
    }

  })
);
