# Strapi plugin Comment Manager

Enable and manage comments for your content very easily!

## [Video tutorial](https://youtu.be/sD3oV6qNgPI)

## Requirements

You should have installed an instance of Strapi v4.x.x

## Installation

Run the following command in your project root:

```bash
npm install strapi-plugin-comment-manager
```

## Configurarion

For your frontend to have access to the API, enable the following permissions for **Comment Manager** from **Users & Permissions Plugin** on your project settings:

For public, enable: **count**, **find** and **getPageSize**.

For authenticated, enable **create** on both Comment and Subcomment.

## Display comments on the frontend

Comments can be displayed in the frontend in two ways:

1. Using the React components library [strapi-comments-client](https://npmjs.com/package/strapi-comments-client) **(recommended)**
2. Build your custom frontend using the API

## API

There are some Typescript interfaces that will help to get an idea of the data structures.

### Comments:

```ts
interface IComment {
  id: string;
  from_admin: boolean;
  createdAt: string;
  content: string;
  author: IAuthor | null;
  subcomments?: ISubcomment[];
}
```

### Subcomments:

```ts
interface ISubcomment {
  id: string;
  from_admin: boolean;
  createdAt: string;
  content: string;
  author: IAuthor | null;
}
```

### Authors:

```ts
interface IAuthor {
  username: string;
  email: string;
  id: string;
}
```

The following endpoints are exposed to fetch and post comments and subcomments:

### Get comments for a content ID

**Method**: GET

**Path**: /api/comment-manager/comments/:slug

**Optional query parameters**: start, ignoreCount

**Returns**:

```ts
{
  commentsCount?: Number;
  comments: IComment[];
}
```

The parameter `start` indicates how many comments to skip. This is for pagination purposes.

The parameter `ignoreCount` indicates whether or not to return the total number of comments associated with the given slug.

---

### Get the number of comments associated with a given content ID

**Method**: GET

**Path**: /api/comment-manager/comments/:slug/count

**Returns**:

```ts
{
  count: Number;
}
```

### Post a comment

**Method**: POST

**Path**: /api/comment-manager/comments/:slug

**Authentication**: Bearer token

**Payload**:

```ts
{
  content: string;
}
```

**Returns**:

```ts
{
  id: Number;
}
```

### Post a subcomment

**Method**: POST

**Path**: /api/comment-manager/subcomments/:parent-id

**Authentication**: Bearer token

**Payload**:

```ts
{
  content: string;
}
```

**Returns**:

```ts
{
  id: Number;
}
```

### Get the page size

**Method**: GET

**Path**: /api/comment-manager/page-size

**Returns**:

```ts
{
  pageSize: Number;
}
```

## General settings

The plugin allows to set how many comments are returned per page by going to the **Pagination** section under **Comment Manager Plugin** on the **Settings** section.

The default page size is 10.

## Management of comments

Admin users are able to delete comments and subcomments as well as leave replies as admins from within the plugin page of the Strapi admin dashboard.

The plugin interface has two tabs: one for the latest comments and one for comments by content ID.

## Submitting issues

Issues are submitted to [https://github.com/luisguve/strapi-plugin-comment-manager/issues](https://github.com/luisguve/strapi-plugin-comment-manager/issues). Please provide as much information as possible about the bug or feature request.

## Tutorial

For more detailed instructions on how to install, configure & use this plugin, check out [this post](https://luisguve.github.io/tutorials/how-to-enable-and-manage-comments-in-your-strapi-application/).
