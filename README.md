ng-crud
=======
Angular-based CRUD

Ingredients:
------------
- Server
  - node.js
  - Connect as server engine
  - CoffeeScript as programming language
  - MongoDB as database
- Client
  - Angular
  - jQuery
  - Bootstrap


Setup:
------
- Requirements
  - Node.js: https://nodejs.org/
  - MongoDB: https://www.mongodb.org/
- Install
  - Clone repository: `$ git clone https://github.com/lcrespom/ng-crud.git`
  - Get dependencies: `npm install`
  - Build: `npm run make build`
- Run
  - Start MongoDB (check out the mongo and mongo-mac scripts in `package.json` as examples)
  - Start server: `npm start`
  - Open browser at http://localhost:1337


ToDo
----
- Browser
  - ~~CRUD~~
    - ~~Create~~
    - ~~Read~~
  	- ~~Update~~
  	- ~~Delete~~
  - Form validation
  - ~~Enter & Esc keys to confirm / cancel forms and dialogs~~
  - Improve feedback to user
    - Show 'loading...' when performing AJAX
    - Show error message upon AJAX error response
  - Angular components for most common web elements
    - Form inputs
      - ~~Input~~
      - ~~Select~~
      - Checkbox
      - ~~Textarea~~
      - Etc (radio...)
      - ~~Generic support for crudInput directives~~
    - Form buttons
      - ~~Create / Update~~
      - others?
    - ~~CRUD table~~
  - Filters
    - ~~Singularize (to name a single item in collection)~~
  - IE bugs
    - Browser cache is being used when sending JSON requests
  - Apply best practices as described in https://github.com/johnpapa/angular-styleguide
    (to a reasonable extent)
  - Introduce ES6 in the make cycle
  - Use JSON schema
    - To define metadata (or at least part of it)
    - To apply validation rules when editing a form
  - Search form
    - ~~Search button unfolds search form~~
    - Search data filters table query
    - Buttons: ~~Search~~ / clear / ~~close~~
    - Search query and search panel status is maintained independently for
        each collection. When the user navigates out and back into a collection
        table, the search status is restored from memory.
  - Custom table action buttons
    - Provide custom directive for rendering custom table buttons
  - Sortable table (by clicking on column headers)

- Server
  - Access control
    - Only allow access to specified collections, reject unspecified collections
    - Only allow access to specified properties in collections
    - Use JSON schema
      - To reject invalid properties in request
      - To filter unspecified properties in response
      - To validate input data

