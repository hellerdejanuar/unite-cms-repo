module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/api/home',
      handler: 'event.getHomePackage',
      config: {
        auth: false,
      }
    }
  ]
}