import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";
import { api, Kernel, schema } from "@modelicahub/kernel";

export function createServer(kernel: Kernel): Express {
  const app = express();
  return app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(cors())
    .all(
      "/graphql",
      createHandler({
        context(req: any, res: any) {
          //console.log(req.raw);
          return req;
        },
        schema: schema(),
        rootValue: api(kernel),
      }),
    )
    .get("/", (_req: any, res: any) => {
      res.type("html");
      res.end(ruruHTML({ endpoint: "/graphql" }));
    });
}
