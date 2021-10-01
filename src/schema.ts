import { GraphQLLiveDirective } from "@n1ru4l/graphql-live-query";
import { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList } from "graphql"

let names = ["John Doe",  "Jane Doe"]

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: () => ({
      names: {
        type: GraphQLList(GraphQLString),
        resolve: async () => names
      }
    })
  }),
   mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: () => ({
      addName: {
        args: {
          name: {
            type: GraphQLString
          },
        },
        type: GraphQLList(GraphQLString),
        resolve: async (_root, args, context) => {
          context.liveQueryStore.invalidate(`Query.names`);
          names = [...names, args.name];
          return names
        },
      },
    }),
   }),
   directives: [GraphQLLiveDirective]
});

export default schema;