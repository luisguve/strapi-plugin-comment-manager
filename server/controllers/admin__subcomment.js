'use strict';

/**
 *   controller
 */

module.exports = {
  async create(ctx) {
    const { parent } = ctx.params
    const { content } = ctx.request.body
    if (!content) {
      return ctx.badRequest("The value of key content must be set", {parent, content})
    }
    // Create subcomment and associate it with the parent comment.
    const newSubcomment = await strapi.entityService.create(
      "plugin::comment-manager.subcomment",
      {
        data: {
          content,
          parent_comment: parent,
          from_admin: true
        }
      }
    )
    ctx.body = { id: newSubcomment.id }
  },
  async delete(ctx) {
    const { id } = ctx.params
    await strapi.entityService.delete("plugin::comment-manager.subcomment", id)
    return { ok: "true" }
  }
}
