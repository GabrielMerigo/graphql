import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";
import { buildSchema } from "graphql";

const categories = [];
// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Category {
    id: ID!
    name: String
    description: String
    courses: [Course!]!
  }

  type Course {
    id: ID!
    name: String
    description: String
    category: Category!
  }

  input NewCategory {
    name: String
    description: String
  }

  input NewCourse {
    name: String
    description: String
    categoryId: ID!
  }

  type Query {
    categories: [Category!]!
    courses: [Course!]!
  }

  type Mutation {
    createCategory(input: NewCategory): Category!
    createCourse(input: NewCourse): Course!
  }

  schema {
    query: Query,
    mutation: Mutation,
  }
`);

// The root provides a resolver function for each API endpoint
var app = express();

// Create and use the GraphQL handler.
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: {
      categories: () => categories,
      createCategory: (args) => {
        const category = {
          id: Math.random().toString(36).substr(2, 9),
          name: args.input.name,
          description: args.input.description
        };

        categories.push(category);
        return category;
      },
    },
  })
);

app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

// Start the server at port
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
