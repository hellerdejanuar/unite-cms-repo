module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/home/:id',
      handler: 'event.getHomePackage'
    }
  ]
}