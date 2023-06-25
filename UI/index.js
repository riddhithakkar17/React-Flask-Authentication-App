const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const { MONGODB } = require("./config.js");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs, // Query + Mutation
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log("MongoDB connected");
    return server.listen({ port: 3001 });
  })
  .catch((err) => {
    console.log(err);
  });

// server.listen({ port: 5000 }).then((res) => {
//   console.log(`Server started at ${res.url}`);
// });
