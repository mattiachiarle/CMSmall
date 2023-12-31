[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/_XpznRuT)
# Exam #1: "CMSmall"

## Student: s308472 CHIARLE MATTIA 

# Server side

## API Server

- POST `/api/login`
  - request parameters and request body content
  ```
  request parameters: none
  request body: 
  {
    username: "user1@polito.it",
    password: "password"
  }
  ```
  - response body content
  ```
  {
    id: 1,
    email: "user1@polito.it",
    username: "user1",
    role: "user"
  }
  ```
- GET `/api/session`
  - request parameters and request body content
  ```
  none
  ```
  - response body content
  ```
  {
    id: 1,
    email: "user1@polito.it",
    username: "user1",
    role: "user"
  }
  ```
- POST `/api/logout`
  - request parameters and request body content
  ```
  none
  ```
  - response body content
  ```
  none
  ```
- GET `/api/website`
  - request parameters and request body content
  ```
  none
  ```
  - response body content
  ```
  {
    name: "Website name"
  }
  ```
- GET `/api/pages/:mode`
  - request parameters
  ```
  mode (it can be frontoffice or backoffice)
  I won't report twice the body since it'll be the same in both cases. The only difference is that with mode=backoffice we'll get also draft and scheduled pages.
  ```
  - response body content
  ```
  Frontoffice

  [
    {
      id:1,
      title: "page1",
      author: "user1",
      creationDate: "2023-06-05",
      publicationDate: "2023-04-12",
      blocks: [
        {
          id:3,
          type: "header",
          content: "header1",
          position:1
        },
        {
          id:6,
          type: "image",
          content:1
          position:2
        }
      ]
    },
    {
      id:4,
      title: "page3",
      author: "user2",
      creationDate: "2023-06-09",
      publicationDate:null,
      blocks: [
        {
          id:10,
          type: "header",
          content: "test",
          position:1
        },
        {
          id:8,
          type: "paragraph",
          content: "A paragraph with some text"
          position:2
        }
      ]
    }
  ]
  ```
- GET `/api/pages/:pageid/view`
  - request parameters
  ```
  pageid: the id of the displayed page.
  ```
  - response body content
  ```
  {
    id:1,
    title: "page1",
    author: "user1",
    creationDate: "2023-06-05",
    blocks: [
      {
        id:3,
        type: "header",
        content: "header1",
        position:1
      },
      {
        id:6,
        type: "image",
        content:1
        position:2
      }
    ]
  }
  ```
- POST `/api/pages`
  - request parameters and request body content
  ```
  request parameters: none

  The id field of the blocks in the request body will be ignored. It's used in the client to identify the different blocks, but it's useless on server side since it'll be automatically assigned by the DB.

  request body:
  {
    title: "page1",
    publicationDate: "2023-06-20",
    blocks: [
      {
        id:1,
        type: "header",
        content: "header1",
        position:1
      },
      {
        id:2,
        type: "image",
        content:1
        position:2
      }
    ]
  }
  ```
  - response body content
  ```
  none
  ```

- PUT `/api/pages/:pageid`
  - request parameters and request body content
  ```
  request parameters: pageid, i.e. the id of the page that we want to modify

  In the request body we've 4 arrays:
    - blocks: it contains all the blocks related to the edited page.
    - addedBlocks: ids of all the blocks that are added.
    - updatedBlocks: ids of all the blocks that were already present but were modified.
    - deletedBlocks: ids of all the blocks that have been deleted.

  request body:
  {
    title: "Page1",
    author: "user1" (it can be different than the one in the DB only if the user that's performing the action is an admin),
    publicationDate: "2023-06-18",
    blocks: [
      {
        id:1,
        type: "header",
        content: "header1",
        position:2
      },
      {
        id:5,
        type: "image",
        content:2
        position:1
      },
      {
        id:3,
        type: "header",
        content: "new header",
        position:3
      }
    ],
    addedBlocks: [
      5
    ]
    updatedBlocks: [
      3
    ],
    deletedBlocks: [
      2,7
    ]
  }
  ```
  - response body content
  ```
  none
  ``` 

- DELETE `/api/pages/:pageid`
  - request parameters and request body content
  ```
  request parameters: pageid, i.e. the id of the page that we want to delete
  request body: none
  ```
  - response body content
  ```
  none
  ``` 

- GET `/api/users`
  - request parameters and request body content
  ```
  none
  ```
  - response body content
  ```
  [
    {username:"user1"},
    {username:"user2"},
    {username:"admin1"},
    {username:"admin2"},
  ]
  ``` 

- PUT `/api/website`
  - request parameters and request body content
  ```
  request parameters: none
  request body:
  {
    name: "newName"
  }
  ```
  - response body content
  ```
  none
  ``` 

## Database Tables

- Table `Users` - contains id, email, username, hashedPassword, salt, role (available roles: user, admin)
- Table `Pages` - contains id, title, creatorId, creatorUsername, creationDate, publicationDate (the status of the page will be retrieved by comparing publicationDate and the current date. I decided to store creatorName too to avoid the need of doing joins when we want to display a page)
- Table `Blocks` - contains id, type, content, pageId, position (for headers and paragraphs content=text of the block, for images content=number of the image)
- Table `Website` - contains id, name (actually the id and, more in general, the table would be useless since it'll contain only one record. However, the only way to save in a persistent way the name of the website is to store it into the DB, and thus it's necessary to create this table too)

# Client side


## React Client Application Routes

- Route `/frontoffice`: list of all the visible pages, with a link for each of them to view it.
- Route `/backoffice`: list of all the pages, with the possibility to edit and delete them (if we have the permission to do it).
- Route `/pages/:pageid`: view the page content (in particular title, author, creationDate, publicationDate and blocks). pageid is the id of the viewed page.
- Route `/add`: form to create a page.
- Route `/editPage/:pageid`: form to edit a certain page. pageid is the id of the edited page.
- Route `/editWebsite`: form to edit the website name.
- Route `/login`: form to perform the login.

## Main React Components

- `Layout` (in `Layout.jsx`): it shows the navbar, that will contain the correct buttons depending on the login status and on the page viewed.
- `EditWebsite` (in `Layout.jsx`): form to update the website name.
- `Login` (in `Login.jsx`): form to perform the login.
- `ShowPublicPages` (in `Pages.jsx`): it displays the list of public pages, i.e. the ones visible in the frontoffice. Each page title has a link to view the page.
- `ShowAllPages` (in `Pages.jsx`): it displays the list of all pages, i.e. the ones visible in the backoffice. It also has buttons to edit, delete or add a page.
- `ViewPage` (in `Pages.jsx`): it displays a page and all its blocks. It has a back button to come back to the frontoffice.
- `AddPage` (in `Pages.jsx`): form to add a page. It allows to insert page properties, to insert new blocks, to delete them, to reorder them and to change their content.
- `EditPage` (in `Pages.jsx`): form to edit a page. It allows to modify the page properties and/or existing blocks. In addition, it allows the user to create or delete blocks and to reorder them.

# Usage info

## Example Screenshot

### Add a new page

![New page](./img/addPage.png)

### Backoffice for an user

![Backoffice](./img/allPages.png)

## Users Credentials

- email: user1@polito.it, username: user1, password: password (role: user)
- email: user2@polito.it, username: user2, password: password (role: user)
- email: admin1@polito.it, username: admin1, password: password (role: admin)
- email: admin2@polito.it, username: admin2, password: password (role: admin)

## Notes

user1 has authored 2 pages, user2 has authored no pages
