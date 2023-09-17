// ## EXPORTS

module.exports = {
  async findAllUsers(ctx) {
    const users = await strapi.entityService.findMany(
      "plugin::users-permissions.user",
      {
        fields: ['id', 'public_name', 'username'],
        populate: { profile_image: true }
      }
    );
    console.log(ctx);
    ctx.body = users;
  }
}