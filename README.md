# The Top 5 Lister
CSE 316 Final Project
by Taylor Giles

## Description
The Top 5 Lister is a web app which allows users to create and view lists of their Top 5 favorite... anything! Users can create lists, share their lists with others, and view "community lists," which are auto-generated lists that combine the items from all the individual lists with the same name and rank them accordingly. 

The Top 5 Lister was assigned as a final project for the CSE 316 Software Development course at Stony Brook University in Fall 2021. The project was intended to teach MERN development and following of specifications. More specifically, the assignment was to implement the application according to the provided design and behavior specifications.

## How to Run
Since the Top 5 Lister was created as an assignment to teach MERN development, it uses MongoDB, Express, React and Node. Therefore, to run the app locally, the appropriate technologies will need to be installed.

1. Clone this repository
1. Install Node and run `npm install` in both the `client` directory and the `server` directory
1. Install [MongoDB](https://docs.mongodb.com/manual/administration/install-community/) and start it on localhost port 4000
1. In the `server` directory, run `npm install -g nodemon` and `nodemon index.js` to install and use nodemon to start the server
1. In the `client` directory, run `npm start` to start the application
1. You should be greeted with the welcome page, as specified by the assignment. From here you may create an account, log in, or continue as a guest.
* Note that there is some pre-created "test" data in the `test` directory. If you wish to simulate normal usage of the application, add this data to the MongoDB server, for example via [Mongo Compass](https://www.mongodb.com/try/download/compass). This will populate the app with several premade accounts and lists, each having some likes, dislikes, and comments.
