import Modelica36 from "@modelicahub/tree-sitter-modelica36";
import { ModelicaContext } from "../common/context.js";
import Parser, { Tree } from "tree-sitter";

export class ModelicaNodeContext extends ModelicaContext {
  static #parser: Parser;

  constructor() {
    super();
    if (ModelicaNodeContext.#parser == null) throw new Error("not initialized");
  }

  static initialize(): void {
    if (ModelicaNodeContext.#parser != null) return;
    let parser = new Parser();
    parser.setLanguage(Modelica36);
    ModelicaNodeContext.#parser = parser;
  }

  parse(input: string): Tree {
    return ModelicaNodeContext.#parser.parse(input);
  }
}
