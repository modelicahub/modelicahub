import { AbstractSyntax } from "./common/syntax.js";
import { ModelicaNodeContext } from "./node/context.js";
import { encode, decode } from "@ipld/dag-json";

ModelicaNodeContext.initialize();
const context = new ModelicaNodeContext();