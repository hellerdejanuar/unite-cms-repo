// ## EXPORTS

module.exports = {
  async getAllUsers(ctx) {
    const users = await strapi.entityService.findMany(
      "plugin::users-permissions.user",
      {
        fields: ['id', 'public_name', 'username'],
        populate: { profile_image: true },
        filters: { status: true } // show only with Status: True
      }
    );
    console.log(ctx);
    ctx.body = users;
  }
}