const find = require("./find")
const friends = require("./friends")


async function create(ctx) {
  return 'ok'
}

module.exports = ({
  create,
  find,
  friends
});