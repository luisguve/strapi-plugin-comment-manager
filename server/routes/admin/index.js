'use strict';

module.exports = {
  type: "admin",
  routes: [
    {
      method: 'GET',
      path: '/',
      handler: 'admin__comment.index',
      config: {
        policies: [],
      }
    },
    {
      method: "GET",
      path: "/comments",
      handler: "admin__comment.findKeys",
      config: {
        policies: []
      }
    },
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
      handler: "admin__comment.create",
      config: {
        policies: []
      }
    },
    {
      method: "DELETE",
      path: "/comments/:id",
      handler: "admin__comment.delete",
      config: {
        policies: []
      }
    },
    {
      method: "POST",
      path: "/subcomments/:parent",
      handler: "admin__subcomment.create",
      config: {
        policies: []
      }
    },
    {
      method: "DELETE",
      path: "/subcomments/:id",
      handler: "admin__subcomment.delete",
      config: {
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/page-size',
      handler: 'comment.getPageSize',
      config: {
        policies: [],
      }
    },
    {
      method: 'POST',
      path: '/page-size',
      handler: 'admin__comment.setPageSize',
      config: {
        policies: [],
      }
    }
  ]
}