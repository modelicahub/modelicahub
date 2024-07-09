import { Tree } from "tree-sitter";

export abstract class ModelicaContext {
  abstract parse(input: string): Tree;
}
