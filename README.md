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
- POST `/api/logout`
  - request parameters and request body content
  ```
  none
  ```
  - response body content
  ```
  none
  ```
- GET `/api/pages/:mode`
  - request parameters
  ```
  mode (it can be frontoffice or backoffice)
  I won't report twice the body since it'll be the same in both cases. The only difference is that with mode=backoffice we'll get also draft and scheduled pages.
  ```
  - response body content
  ```
  [
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
          content: "img/image1.png"
          position:2
        }
      ]
    },
    {
      id:4,
      title: "page3",
      author: "user2",
      creationDate: "2023-06-09",
      blocks: [
        {
          id:6,
          type: "header",
          content: "test",
          position:1
        },
        {
          id:6,
          type: "paragraph",
          content: "A paragraph with some text"
          position:2
        }
      ]
    }
  ]
  ```
- GET `api/pages/:pageid`
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
        content: "img/image1.png"
        position:2
      }
    ]
  }
  ```
- POST `/api/pages`
  - request parameters and request body content
  ```
  request parameters: none
  request body:
  {
    title: "page1",
    authorId:1,
    publicationDate: "2023-06-20",
    blocks: [
      {
        type: "header",
        content: "header1",
        position:1
      },
      {
        type: "image",
        content: "img/image1.png",
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
  request body:
  {
    title: "Page1",
    publicationDate: "2023-06-18",
    updatedBlocks: [
      {
        id:3,
        type: "header",
        content: "header1",
        position:2
      },
      {
        id:6,
        type: "image",
        content: "img/image2.png"
        position:1
      },
      {
        id:12,
        type: "header",
        content: "new header",
        position:3
      },
    ]
    deletedBlocks: [
      ...
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

- PUT `/api/pages/:pageid/author`
  - request parameters and request body content
  ```
  request parameters: pageid, i.e. the id of the page that we want to update
  request body:
  {
    author: "newAuthor"
  }
  ```
  - response body content
  ```
  none
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
- Table `Blocks` - contains id, type, content, pageId, position (for headers and paragraphs content=text of the block, for images content=path of the image)
- Table `Website` - contains id, name (actually the id and, more in general, the table would be useless since it'll contain only one record. However, the only way to save in a persistent way the name of the website is to store it into the DB, and thus it's necessary to create this table too)

# Client side


## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...


## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

# Usage info

## Example Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- user1@polito.it, user1, password (role: user)
- user2@polito.it, user2, password (role: user)
- admin1@polito.it, admin1, password (role: admin)
- admin2@polito.it, admin2, password (role: admin)
