import fastify from "fastify";
import { getGraphQLParameters, processRequest, renderGraphiQL, sendResult, shouldRenderGraphiQL } from "graphql-helix";
import { InMemoryLiveQueryStore } from "@n1ru4l/in-memory-live-query-store";



const liveQueryStore = new InMemoryLiveQueryStore();

import schema from "./schema"

const app = fastify({
  logger: true
});

app.register(require('fastify-cors'), {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
})


app.route({
  method: ["GET", "POST"],
  url: "/graphql",
  async handler(req, res) {
    const request = {
      body: req.body,
      headers: req.headers,
      method: req.method,
      query: req.query,
    };

    if (shouldRenderGraphiQL(request)) {
      res.type("text/html");
      res.send(renderGraphiQL({}));
    } else {
      const request = {
        body: req.body,
        headers: req.headers,
        method: req.method,
        query: req.query,
      };
      const { operationName, query, variables } = getGraphQLParameters(request);
      const result = await processRequest({
        operationName,
        query,
        variables,
        request,
        schema,
        contextFactory: () => ({
        liveQueryStore,
      }),
      execute: liveQueryStore.execute,
      });

      sendResult(result, res.raw);
    }
  },
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`GraphQL server is running on port ${port}.`);
});