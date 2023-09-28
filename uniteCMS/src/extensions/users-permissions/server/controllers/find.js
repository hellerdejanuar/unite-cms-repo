// ## EXPORTS

module.exports = {
  async findAllUsers(ctx) {
    const users = await strapi.entityService.findMany(
      "plugin::users-permissions.user",
      {
        fields: ['id', 'public_name', 'username'],
        populate: { profile_image: true },
        filters: { status: true }, // show only with Status: True
        sort: 'public_name',
      }
    );
    ctx.body = users;
  }
}
