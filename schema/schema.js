// tells graphql what data will look like (what prop type it has)
const graphql = require('graphql') // import graphql library
const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql // deconstruct
const url = 'http://localhost:3000';

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`${url}/companies/${parentValue.id}/users`)
        .then(res => res.data); // bi-relational
      }
    }
  })
});

// identifies what data type user is
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString},
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: { 
      type: CompanyType, // associates company with user
      resolve(parentValue, args) {
        return axios.get(`${url}/companies/${parentValue.companyId}`)
        .then(res => res.data); // bi-relational
      }
    }
  })
});

// query to get information (get)
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: { // query for specific user
      type: UserType,
      args: { id: { type: GraphQLString }}, // expects argument of id to find user
      resolve(parentValue, args) { // goes into database and retrieve query
        return axios.get(`${url}/users/${args.id}`)
          .then(res => res.data); // for graphql to be able to read axios
      } 
    },
    company: { // query for specific company
      type: CompanyType,
      args: { id: {type: GraphQLString }},
      resolve(parentValue, args) {
        return axios.get(`${url}/companies/${args.id}`)
          .then(res => res.data);
      }
    }
  }
});

// mutation to alter information (post, update, delete)
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: { // add user info
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { firstName, age }) { //deconstruct args
        return axios.post(`${url}/users`, { firstName, age })
          .then(res => res.data); // best practice to return what you send
      }
    },
    deleteUser: { // delete specific user info
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) } // requires id
      },
      resolve(parentValue, { id }) {
        return axios.delete(`${url}/users/${id}`)
          .then(res => res.data); // should return null
      }
    },
    editUser: { // edit specific user information
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios.patch(`${url}/users/${args.id}`, args)
        .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});