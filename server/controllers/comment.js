'use strict';

/**
 *   controller
 */

// const { createCoreController } = require('@strapi/strapi').factories;

// const base = createCoreController('plugin::comment-manager.comment');

module.exports = {
  async find(ctx) {
    const { slug } = ctx.params
    const { start, ignoreCount } = ctx.request.query
    const pageSize = await strapi.service('plugin::comment-manager.comment').getPageSize()
    const comments = await strapi.entityService.findMany("plugin::comment-manager.comment",
      {
        filters: { related_to: { slug } },
        limit: pageSize,
        start,
        sort: { createdAt: "DESC" },
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
    let commentsCount
    if (!ignoreCount) {
      commentsCount = await strapi.db.query("plugin::comment-manager.comment")
      .count(
        {
          where: {
            related_to: { slug }
          }
        }
      )
    }
    ctx.body = {
      commentsCount,
      comments
    }
  },
  async getPage(ctx) {
    const { slug } = ctx.params
    const { start } = ctx.request.query
    const pageSize = await strapi.service('plugin::comment-manager.comment').getPageSize()
    const comments = await strapi.entityService.findMany("plugin::comment-manager.comment",
      {
        filters: { related_to: {slug} },
        limit: pageSize,
        start,
        sort: { createdAt: "DESC" },
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
  async create(ctx) {
    const { user } = ctx.state
    if (!user) {
      return ctx.badRequest("The user should be authenticated")
    }
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
        data: { slug }
      })
    }
    // Create comment and associate it with id.
    const newComment = await strapi.entityService.create("plugin::comment-manager.comment", {
      data: {
        author: user.id,
        content,
        related_to: contentID.id
      }
    })
    ctx.body = { id: newComment.id }
  },
  async getPageSize() {
    const pageSize = await strapi.service('plugin::comment-manager.comment').getPageSize()
    return { pageSize }
  },
  async count(ctx) {
    const { slug } = ctx.params
    // count comments related to this content
    const commentsCount = await strapi.db.query("plugin::comment-manager.comment").count({
      where: {
        related_to: { slug }
      }
    })
    // count subcomments related to this content
    const subcommentsCount = await strapi.db.query("plugin::comment-manager.subcomment").count({
      where: {
        parent_comment: {
          related_to: { slug }
        }
      }
    })
    return {
      count: commentsCount + subcommentsCount
    }
  }
}
