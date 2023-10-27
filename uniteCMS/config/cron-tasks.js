const eventCountReport = {
  task: async ({strapi}) => {
    const eventCountPromise = strapi.entityService.count(
      "api::event.event", { status: true }
    );
  
    const userCountPromise = strapi.entityService.count(
      "plugin::users-permissions.user", { status: true }
    );
  
    const [eventCount, userCount] = await Promise.all([
      eventCountPromise,
      userCountPromise
    ]);
  
    const date = new Date().toLocaleString('en-GB', { timeZone: 'UTC' });
  
    console.log(`[${date}] Usage report: ${eventCount} Events and ${userCount} Users (run by Strapi cron)`);
  },
  options: {
    rule: '*/30 * * * * *',
  }
}

const expireEvents = {
  task: async ({strapi}) => {
    const now = new Date()
    const defaultEventDuration = 2 * 60 * 60 * 1000 // 2 hours in ms
    const timeZoneOffset = -3 * 60 * 60 * 1000 // 2 hours in ms
    const datePlusOffset = new Date(now.getTime() + defaultEventDuration + timeZoneOffset).toISOString()

    // update every event with status = false and event_datetime < now + 2hs
    const expiredEvents = await strapi.query("api::event.event").updateMany({
                            where: { 
                              $and: [
                                { event_datetime: { $lt: datePlusOffset }}, 
                                { status: true } 
                              ]
                            },
                            data: { status: false },
                          });

    console.debug(expiredEvents);

    // TODO: expire events via query
    console.log(`[${now.toLocaleString('en-GB', { timeZone: 'America/Montevideo' })}] Expire ${expiredEvents.count} events (cronTask)`);
  },
  options: {
    rule: '*/10 * * * *',
  }
}
  
module.exports = {
  // eventCountReport,
  expireEvents,
}