'use strict';

/**
 *   controller
 */

//const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('plugin::comment-manager.subcomment');

module.exports = {
  async create(ctx) {
    const { user } = ctx.state
    if (!user) {
      return ctx.badRequest("The user should be authenticated")
    }
    const { parent } = ctx.params
    const { content } = ctx.request.body
    if (!content) {
      return ctx.badRequest("Content should not be empty", {parent, content})
    }
    // Create subcomment and associate it with the parent comment.
    const newSubcomment = await strapi.entityService.create(
      "plugin::comment-manager.subcomment",
      {
        data: {
          author: user.id,
          content,
          parent_comment: parent
        }
      }
    )
    ctx.body = { id: newSubcomment.id }
  }
}
