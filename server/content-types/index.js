const comment = require("./comment/schema.json")
const subcomment = require("./subcomment/schema.json")
const contentID = require("./content-id/schema.json")

module.exports = {
  comment: {schema: comment},
  subcomment: {schema: subcomment},
  "content-id": {schema: contentID},
}
