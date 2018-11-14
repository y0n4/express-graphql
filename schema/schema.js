// tells graphql what data will look like (what prop type it has)
const graphql = require('graphql') // import graphql library
const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
} = graphql // deconstruct

// identifies what data type user is
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString},
    firstName: {type: GraphQLString},
    age: { type: GraphQLInt},
  } 
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString }}, // expects argument of id to find user
      resolve(parentValue, args) { // goes into database and retrieve query
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(response => response.data); // for graphql to be able to read axios
      } 
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});