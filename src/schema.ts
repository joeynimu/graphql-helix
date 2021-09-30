import { GraphQLObjectType, GraphQLString, GraphQLSchema } from "graphql"

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: () => ({
      hello: {
        type: GraphQLString,
        resolve: async () => `World`
      },
    })
  })
});

export default schema;