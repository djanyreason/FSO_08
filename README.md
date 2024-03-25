This repository is for exercises in Part 8 of Full Stack Open (FSO), "GraphQL" - https://fullstackopen.com/en/part8

The exercises for this part build a full-stack web application, using a graphQL server with data stored in a MongoDB database.
The backend server is initially built off of code provided here: https://github.com/fullstack-hy2020/misc/blob/master/library-backend.js
The frontend react applicaiton is built off of the project in this gitHub repository: https://github.com/fullstack-hy2020/library-frontend
The database connection using Mongoose and apollo is initially based off of code provided here: https://github.com/fullstack-hy/misc/blob/main/library-schema.md

This project creates a web application that lists a collection of books in a library. It includes navigation buttons at the top of the application to display all books and all authors.  The books view also includes buttons to filter the books by genre.

The app also handles user authentication - when no user is logged in, the navigation buttons include a login option which takes the user to a login form. When a registered user is logged in, the navigation buttons also include buttons for "add book", "recommend", and "logout". The logout button logs out the user. The "reocmmend" view shows the books in the library which are in the user's favorite genre. The "add book" button displays a form to add a book to the library.

When a user is logged in, the authors view also allows the user to update the birth year of an author.

This project is focused on using GraphQL with React for frontend, Apollo Server for backend, and Mongoose for database. It includes GraphQL schemas, queries, mutations, enums, fragments, and subscriptions on both server and client. It also includes managing and manipulating the cache in the frontend, and includes token-based user authentication in this environment.
