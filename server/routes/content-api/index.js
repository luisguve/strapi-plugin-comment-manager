'use strict';

module.exports = {
  type: "content-api",
  routes: [
    {
      method: "GET",
      path: "/comments/:slug",
      handler: "comment.find",
      config: {
        policies: []
      }
    },
    {
      method: "GET",
      path: "/comments/:slug/count",
      handler: "comment.count",
      config: {
        policies: []
      }
    },
    {
      method: "POST",
      path: "/comments/:slug",
      handler: "comment.create",
      config: {
        policies: []
      }
    },
    {
      method: "POST",
      path: "/subcomments/:parent",
      handler: "subcomment.create",
      config: {
        policies: []
      }
    },
    {
      method: "GET",
      path: "/page-size",
      handler: "comment.getPageSize",
      config: {
        policies: []
      }
    }
  ]
}