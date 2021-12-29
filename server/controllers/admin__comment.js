'use strict';

/**
 *   controller
 */

module.exports = {
  async index(ctx) {
    const { start, ignoreCount } = ctx.request.query
    const pageSize = await strapi.service('plugin::comment-manager.comment').getPageSize()
    const comments = await strapi.entityService.findMany("plugin::comment-manager.comment",
      {
        limit: pageSize,
        filters: {},
        start,
        sort: { createdAt: "desc" },
        populate: {
          related_to: { fields: ["slug"] },
          author: { fields: ["id", "username", "email"] },
          subcomments: {
            fields: ["content", "createdAt", "from_admin"],
            populate: { author: { fields: ["id", "username", "email"] } }
          }
        }
      }
    )
    let commentsCount, subcommentsCount
    if (!ignoreCount) {
      commentsCount = await strapi.db.query("plugin::comment-manager.comment").count()
      subcommentsCount = await strapi.db.query("plugin::comment-manager.subcomment").count()
    }
    ctx.body = {
      commentsCount,
      subcommentsCount,
      comments
    }
  },
  async getPage(ctx) {
    const { start } = ctx.request.query
    const pageSize = await strapi.service('plugin::comment-manager.comment').getPageSize()
    const comments = await strapi.entityService.findMany("plugin::comment-manager.comment",
      {
        limit: pageSize,
        filters: {},
        start,
        sort: { createdAt: "desc" },
        populate: {
          related_to: { fields: ["slug"] },
          author: { fields: ["id", "username", "email"] },
          subcomments: {
            fields: ["content", "createdAt", "from_admin"],
            populate: { author: { fields: ["id", "username", "email"] } }
          }
        }
      }
    )
    ctx.body = {
      comments
    }
  },
  async findKeys(ctx) {
    const contents = await strapi.entityService.findMany("plugin::comment-manager.content-id", {
      fields: ["slug", "id"],
      filters: {}
    })
    const res = await Promise.all(contents.map(async (content) => {
      // count comments related to this content
      const commentsCount = await strapi.db.query("plugin::comment-manager.comment").count({
        where: {
          related_to: content.id
        }
      })
      // count subcomments related to this content
      const subcommentsCount = await strapi.db.query("plugin::comment-manager.subcomment").count({
        where: {
          parent_comment: {
            related_to: content.id
          }
        }
      })
      return {
        contentID: content.slug,
        comments: commentsCount + subcommentsCount
      }
    }))
    ctx.body = res
  },
  async create(ctx) {
    const { slug } = ctx.params
    const { content } = ctx.request.body
    if (!content) {
      return ctx.badRequest("Content should not be empty", {slug, content})
    }
    // Get ID of content with the given slug
    // If not exists, this is the fist comment
    // - create the contentID and grab the ID
    let contentID = await strapi.db.query("plugin::comment-manager.content-id").findOne({
      select: ["id"],
      where: {slug}
    })
    if (!contentID) {
      // First comment ever for this content
      contentID = await strapi.entityService.create("plugin::comment-manager.content-id", {
        data: {slug}
      })
    }
    // Create comment and associate it with id.
    const newComment = await strapi.entityService.create("plugin::comment-manager.comment", {
      data: {
        content,
        related_to: contentID.id,
        from_admin: true
      }
    })
    ctx.body = { id: newComment.id }
  },
  async delete(ctx) {
    const { id } = ctx.params
    // Delete parent comment and grab it's subcomments IDs
    const comment = await strapi.entityService.delete("plugin::comment-manager.comment", id, {
      populate: {
        subcomments: {
          fields: ["id"]
        }
      }
    })
    // Then delete subcomments associated with the parent comment just deleted
    await Promise.all(comment.subcomments.map(async (data) => {
      const { id } = data
      await strapi.entityService.delete("plugin::comment-manager.subcomment", id)
    }))
    ctx.body = { ok: "true" }
  },
  async setPageSize(ctx) {
    const { pageSize } = ctx.request.body
    if (!pageSize || pageSize < 1) {
      return ctx.badRequest("pageSize must be greater than 0")
    }
    strapi.service('plugin::comment-manager.comment').setPageSize(pageSize)
    return { ok: true }
  }
}
