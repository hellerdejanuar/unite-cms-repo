module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/home',
      handler: 'event.getHomePackage',
      config: {
        auth: false,
      }
    }
  ]
}