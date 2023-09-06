module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/home/:id',
      handler: 'event.getHomePackage'
    },
    {
      method: 'POST',
      path: '/join/:event_id',
      handler: 'event.join'
    },
    {
      method: 'DELETE',
      path: '/join/:event_id',
      handler: 'event.unjoin'
    },
    
  ]
}