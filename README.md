# Strapi plugin Comment Manager

Enable and manage comments for your content very easily!

## Requirements

You should have installed an instance of Strapi v4.x.x

This plugin does not work on versions of Strapi prior to v4.0.0

## Installation

Run the following command in your project root:

    npm install strapi-plugin-comment-manager

And that's it! If everything runs correctly, the plugin should be installed.

## Configurarion

Now you need to enable some permissions so that the frontend can access the endpoints to post and fetch comments.

In your Strapi admin panel, head over to `Settings`, then over to `Roles` under `Users & Permissions Plugin`.

Let's first setup the Public API; click on `Public` and hit the dropdown button of `Comment Manager`. Now check `count`, `find` and `getPageSize`, then hit the Save button. Below is a picture of a proper configuration:

![Public API permissions](https://raw.githubusercontent.com/luisguve/strapi-plugin-comment-manager/main/public-api.PNG)

Now let's setup the Authenticated API. Go back to `Roles` and click on `Authenticated`. Open the dropdown of `Comment Manager` and mark as checked the option `create` on both Comment and Subcomment. Below is a picture of a proper configuration:

![Authenticated API permissions](https://raw.githubusercontent.com/luisguve/strapi-plugin-comment-manager/main/authenticated-api.PNG)

With this configuration, the frontend should now be able to make requests to get and post comments.

## Display comments on the frontend

The plugin exposes an API to get and post comments if you want to have fine-grained control over the workflow of your comments system, but this plugin also comes with a purpose-built React component library that makes super easy to get up and running without getting your hands dirty.

This component library is called [strapi-comments-client](https://npmjs.com/package/strapi-comments-client), is built using full typescript and it actually handles all of the complexity of fetching and posting comments and subcomments for every content ID that you pass to it.

For instruction on how to install this library and display comments in your React application, see the [README](https://npmjs.com/package/strapi-comments-client) on the package page, and for a full working example of a project using this library, see [this repo](https://github.com/luisguve/strapi-comments-client-example).

If you use this library, this is how the UI will look like. Notice that the library is using the UI components from the [Strapi Design System](https://design-system.strapi.io) introduced in V4.

![Sample UI](https://raw.githubusercontent.com/luisguve/strapi-plugin-comment-manager/main/post.PNG)

## REST API

First of all, there are some Typescript interfaces that will help to get an idea of the data structures.

### Comments:
    interface IComment {
      id: string,
      from_admin: boolean,
      createdAt: string,
      content: string,
      author: IAuthor | null,
      subcomments?: ISubcomment[]
    }

### Subcomments:
    interface ISubcomment {
      id: string,
      from_admin: boolean,
      createdAt: string,
      content: string,
      author: IAuthor | null,
    }

### Authors:
    IAuthor {
      username: string,
      email: string,
      id: string
    }


The following endpoints are exposed to fetch and post comments and subcomments:

### Get comments for a content ID

**Method**: GET
**Path**: /api/comments/:slug
**Optional query parameters**: start, ignoreCount
**Returns**:

    {
      commentsCount?: Number,
      comments: IComment[]
    }

The parameter `start` indicates how many comments to skip. This is for pagination purposes.
The parameter `ignoreCount` indicates whether or not to return the total number of comments a given content slug has.

### Get the number of comments associated with a given content ID

How many comments are associated with the given slug

**Method**: GET
**Path**: /api/comment-manager/comments/:slug/count
**Returns**:

    {
      count: Number
    }

### Post a comment

Posting a top-level comment associated with the given slug

**Method**: POST
**Path**: /api/comment-manager/comments/:slug
**Authentication**: Bearer token
**Payload**:

    {
      content: string
    }

**Returns**:

    {
      id: Number
    }

### Post a subcomment

Replying to a comment

**Method**: POST
**Path**: /api/comment-manager/subcomments/:parent-id
**Authentication**: Bearer token
**Payload**:

    {
      content: string
    }

**Returns**:

    {
      id: Number
    }

### Get the page size

Get how many comments are returned at once for pagination purposes.

**Method**: GET
**Path**: /api/comment-manager/page-size
**Returns**:

    {
      pageSize: Number
    }

## General settings

You can customize the page size, i.e. specify how many comments are returned at once.

In the Strapi admin panel, head over to `Settings`, then select `Pagination` under `Comment Manager Plugin`.

Here you'll find an input to set the page size, which defaults to 10.

## Manage comments

Once you've got the plugin up an running and users start to post comments, you can manage and reply to comments as admin from the Content Manager section of the left sidebar in the Strapi admin panel.

Here you can see two tabs: one for the latest comments and one for comments grouped by content ID.

![Latest comments tab](https://raw.githubusercontent.com/luisguve/strapi-plugin-comment-manager/main/latest-comments.PNG)

![Comments grouped by content ID tab](https://raw.githubusercontent.com/luisguve/strapi-plugin-comment-manager/main/grouped-comments.PNG)

In both of them you can delete comments and subcomments as well as leave replies.

## Roadmap and future plans

The features are pretty basic at the moment but if there's interest, I'm willing to work on more features as well as improvements in the UI/UX.
