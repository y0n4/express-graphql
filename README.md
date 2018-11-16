This repo is strictly just server side to get some practice in GraphQL and Express.

In the project directory start off to install necessary dependencies:
### `npm install`

Then run on json server:
### `npm run json:server`
Runs [http://localhost:3000](http://localhost:3000)<br>
You can change the endpoint and play around with acessing data

For GraphQL to access data from json server:
### `npm run dev`
Open [http://localhost:4000/graphiql](http://localhost:4000/graphiql)<br>
Play with GraphiQL client using GraphQl syntax<br>
Check out the docs on how to make queries and mutations

The data is a simply hardcoded information of random people and company they work at. <br>
The connection between "user" and "company" is bi-relational.