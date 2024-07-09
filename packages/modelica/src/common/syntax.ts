import { SyntaxNode } from "tree-sitter";

function assertSyntaxNodeType(
  type: string,
  syntaxNode?: SyntaxNode | null,
): SyntaxNode {
  if (syntaxNode?.type != type)
    throw new Error(`Expected ${type}, got ${syntaxNode?.type}`);
  return syntaxNode;
}

export abstract class AbstractSyntax {
  #syntaxNode?: SyntaxNode;

  constructor(syntaxNode?: SyntaxNode) {
    this.#syntaxNode = syntaxNode;
  }

  static new(syntaxNode: SyntaxNode | null): AbstractSyntax | null {
    switch (syntaxNode?.type) {
      case "annotationClause":
        return new AnnotationClauseAbstractSyntax(syntaxNode);
      case "binaryExpression":
        return new BinaryExpressionAbstractSyntax(syntaxNode);
      case "classDefinition":
        return new ClassDefinitionAbstractSyntax(syntaxNode);
      case "classModification":
        return new ClassModificationAbstractSyntax(syntaxNode);
      case "classPrefixes":
        return new ClassPrefixesAbstractSyntax(syntaxNode);
      case "componentClause":
        return new ComponentClauseAbstractSyntax(syntaxNode);
      case "componentDeclaration":
        return new ComponentDeclarationAbstractSyntax(syntaxNode);
      case "descriptionString":
        return new DescriptionStringAbstractSyntax(syntaxNode);
      case "elementModification":
        return new ElementModificationAbstractSyntax(syntaxNode);
      case "extendsClause":
        return new ExtendsClauseAbstractSyntax(syntaxNode);
      case "forIndex":
        return new ForIndexAbstractSyntax(syntaxNode);
      case "IDENT":
        return new IdentifierAbstractSyntax(syntaxNode);
      case "logicalLiteral":
        return new LogicalLiteralAbstractSyntax(syntaxNode);
      case "longClassSpecifier":
        return new LongClassSpecifierAbstractSyntax(syntaxNode);
      case "modification":
        return new ModificationAbstractSyntax(syntaxNode);
      case "modificationExpression":
        return new ModificationExpressionAbstractSyntax(syntaxNode);
      case "name":
        return new NameAbstractSyntax(syntaxNode);
      case "storedDefinition":
        return new StoredDefinitionAbstractSyntax(syntaxNode);
      case "stringLiteral":
        return new StringLiteralAbstractSyntax(syntaxNode);
      case "typeSpecifier":
        return new TypeSpecifierAbstractSyntax(syntaxNode);
      case "unaryExpression":
        return new BinaryExpressionAbstractSyntax(syntaxNode);
      case "unsignedIntegerLiteral":
        return new UnsignedIntegerLiteralAbstractSyntax(syntaxNode);
      case "unsignedRealLiteral":
        return new UnsignedRealLiteralAbstractSyntax(syntaxNode);
      case "withinClause":
        return new WithinClauseAbstractSyntax(syntaxNode);
      default:
        return null;
    }
  }

  abstract parse(): void;

  get syntaxNode(): SyntaxNode | undefined {
    return this.#syntaxNode;
  }
}

export class StoredDefinitionAbstractSyntax extends AbstractSyntax {
  classDefinitions: ClassDefinitionAbstractSyntax[] | null = null;
  withinClause: WithinClauseAbstractSyntax | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): StoredDefinitionAbstractSyntax | null {
    if (syntaxNode?.type != "storedDefinition") return null;
    return new StoredDefinitionAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType(
      "storedDefinition",
      this.syntaxNode,
    );

    this.classDefinitions = syntaxNode
      .childrenForFieldName("classDefinition")
      .flatMap(
        (classDefinition) =>
          ClassDefinitionAbstractSyntax.new(classDefinition) ?? [],
      );
    this.withinClause = WithinClauseAbstractSyntax.new(
      syntaxNode.childForFieldName("withinClause"),
    );
  }
}

export class WithinClauseAbstractSyntax extends AbstractSyntax {
  packagePrefixName: NameAbstractSyntax | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(syntaxNode: SyntaxNode | null): WithinClauseAbstractSyntax | null {
    if (syntaxNode?.type != "withinClause") return null;
    return new WithinClauseAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType("withinClause", this.syntaxNode);
    this.packagePrefixName = NameAbstractSyntax.new(
      syntaxNode.childForFieldName("packagePrefixName"),
    );
  }
}

export class ClassPrefixesAbstractSyntax extends AbstractSyntax {
  kind: ClassKind | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): ClassPrefixesAbstractSyntax | null {
    if (syntaxNode?.type != "classPrefixes") return null;
    return new ClassPrefixesAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType("classPrefixes", this.syntaxNode);
    if (syntaxNode.childForFieldName("block") != null) {
      this.kind = ClassKind.BLOCK;
    } else if (syntaxNode.childForFieldName("class") != null) {
      this.kind = ClassKind.CLASS;
    } else if (syntaxNode.childForFieldName("model") != null) {
      this.kind = ClassKind.MODEL;
    } else if (syntaxNode.childForFieldName("package") != null) {
      this.kind = ClassKind.PACKAGE;
    } else {
      throw new Error(`invalid class kind`);
    }
  }
}

export abstract class ClassSpecifierAbstractSyntax extends AbstractSyntax {
  descriptionString: DescriptionStringAbstractSyntax | null = null;
  identifier: IdentifierAbstractSyntax | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): ClassSpecifierAbstractSyntax | null {
    switch (syntaxNode?.type) {
      case "longClassSpecifier":
        return new LongClassSpecifierAbstractSyntax(syntaxNode);
      default:
        return null;
    }
  }

  override parse(): void {
    this.descriptionString = DescriptionStringAbstractSyntax.new(
      this.syntaxNode?.childForFieldName("descriptionString") ?? null,
    );
    this.identifier = IdentifierAbstractSyntax.new(
      this.syntaxNode?.childForFieldName("identifier") ?? null,
    );
  }
}

export class LongClassSpecifierAbstractSyntax extends ClassSpecifierAbstractSyntax {
  annotationClause: AnnotationClauseAbstractSyntax | null = null;
  elements: ElementAbstractSyntax[] = [];
  endIdentifier: IdentifierAbstractSyntax | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): LongClassSpecifierAbstractSyntax | null {
    if (syntaxNode?.type != "longClassSpecifier") return null;
    return new LongClassSpecifierAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType(
      "longClassSpecifier",
      this.syntaxNode,
    );
    super.parse();
    this.annotationClause = AnnotationClauseAbstractSyntax.new(
      syntaxNode.childForFieldName("annotationClause"),
    );
    this.endIdentifier = IdentifierAbstractSyntax.new(
      syntaxNode.childForFieldName("endIdentifier"),
    );
    for (const child of syntaxNode.children) {
      switch (child.type) {
        case "elementList":
          for (const elementNode of child.childrenForFieldName("element")) {
            const element = ElementAbstractSyntax.new(elementNode);
            if (element != null) this.elements.push(element);
          }
          break;
      }
    }
  }
}

export abstract class ElementAbstractSyntax extends AbstractSyntax {
  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
  }

  static new(syntaxNode: SyntaxNode | null): ElementAbstractSyntax | null {
    switch (syntaxNode?.type) {
      case "extendsClause":
        return new ExtendsClauseAbstractSyntax(syntaxNode);
      case "namedElement":
        return NamedElementAbstractSyntax.new(syntaxNode);
      default:
        return null;
    }
  }
}

export class ExtendsClauseAbstractSyntax extends ElementAbstractSyntax {
  typeSpecifier: TypeSpecifierAbstractSyntax | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(syntaxNode: SyntaxNode | null): ElementAbstractSyntax | null {
    if (syntaxNode?.type != "extendsClause") return null;
    return new ExtendsClauseAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType("extendsClause", this.syntaxNode);
    this.typeSpecifier = TypeSpecifierAbstractSyntax.new(
      syntaxNode.childForFieldName("typeSpecifier"),
    );
  }
}

export abstract class NamedElementAbstractSyntax extends AbstractSyntax {
  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
  }

  static new(syntaxNode: SyntaxNode | null): NamedElementAbstractSyntax | null {
    switch (syntaxNode?.type) {
      case "namedElement":
        const classDefinition = ClassDefinitionAbstractSyntax.new(
          syntaxNode.childForFieldName("classDefinition"),
        );
        if (classDefinition != null) return classDefinition;
        const componentClause = ComponentClauseAbstractSyntax.new(
          syntaxNode.childForFieldName("componentClause"),
        );
        if (componentClause != null) return componentClause;
        return null;
      default:
        return null;
    }
  }
}

export class ClassDefinitionAbstractSyntax extends NamedElementAbstractSyntax {
  classPrefixes: ClassPrefixesAbstractSyntax | null = null;
  classSpecifier: ClassSpecifierAbstractSyntax | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): ClassDefinitionAbstractSyntax | null {
    if (syntaxNode?.type != "classDefinition") return null;
    return new ClassDefinitionAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType("classDefinition", this.syntaxNode);
    this.classPrefixes = ClassPrefixesAbstractSyntax.new(
      syntaxNode.childForFieldName("classPrefixes"),
    );
    this.classSpecifier = ClassSpecifierAbstractSyntax.new(
      syntaxNode.childForFieldName("classSpecifier"),
    );
  }
}

export class ComponentClauseAbstractSyntax extends NamedElementAbstractSyntax {
  componentDeclarations: ComponentDeclarationAbstractSyntax[] = [];
  typeSpecifier: TypeSpecifierAbstractSyntax | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): ComponentClauseAbstractSyntax | null {
    if (syntaxNode?.type != "componentClause") return null;
    return new ComponentClauseAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType("componentClause", this.syntaxNode);
    this.typeSpecifier = TypeSpecifierAbstractSyntax.new(
      syntaxNode.childForFieldName("typeSpecifier"),
    );
    for (const child of syntaxNode.childrenForFieldName(
      "componentDeclaration",
    )) {
      const componentDeclaration =
        ComponentDeclarationAbstractSyntax.new(child);
      if (componentDeclaration != null)
        this.componentDeclarations.push(componentDeclaration);
    }
  }
}

export class ComponentDeclarationAbstractSyntax extends AbstractSyntax {
  annotationClause: AnnotationClauseAbstractSyntax | null = null;
  descriptionString: DescriptionStringAbstractSyntax | null = null;
  identifier: IdentifierAbstractSyntax | null = null;
  modification: ModificationAbstractSyntax | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): ComponentDeclarationAbstractSyntax | null {
    if (syntaxNode?.type != "componentDeclaration") return null;
    return new ComponentDeclarationAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType(
      "componentDeclaration",
      this.syntaxNode,
    );
    this.annotationClause = AnnotationClauseAbstractSyntax.new(
      syntaxNode.childForFieldName("annotationClause"),
    );
    this.descriptionString = DescriptionStringAbstractSyntax.new(
      syntaxNode.childForFieldName("descriptionString"),
    );
    this.identifier = IdentifierAbstractSyntax.new(
      syntaxNode.childForFieldName("identifier"),
    );
    this.modification = ModificationAbstractSyntax.new(
      syntaxNode.childForFieldName("modification"),
    );
  }
}

// A.2.5 Modification

export class ModificationAbstractSyntax extends AbstractSyntax {
  classModification: ClassModificationAbstractSyntax | null = null;
  modificationExpression: ModificationExpressionAbstractSyntax | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(syntaxNode: SyntaxNode | null): ModificationAbstractSyntax | null {
    if (syntaxNode?.type != "modification") return null;
    return new ModificationAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType("modification", this.syntaxNode);
    this.classModification = ClassModificationAbstractSyntax.new(
      syntaxNode.childForFieldName("classModification"),
    );
    this.modificationExpression = ModificationExpressionAbstractSyntax.new(
      syntaxNode.childForFieldName("modificationExpression"),
    );
  }
}

export class ModificationExpressionAbstractSyntax extends AbstractSyntax {
  expression: ExpressionAbstractSyntax | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): ModificationExpressionAbstractSyntax | null {
    if (syntaxNode?.type != "modificationExpression") return null;
    return new ModificationExpressionAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType(
      "modificationExpression",
      this.syntaxNode,
    );
    this.expression = ExpressionAbstractSyntax.new(
      syntaxNode.childForFieldName("expression"),
    );
  }
}

export class ClassModificationAbstractSyntax extends AbstractSyntax {
  arguments: ArgumentAbstractSyntax[] = [];

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): ClassModificationAbstractSyntax | null {
    if (syntaxNode?.type != "classModification") return null;
    return new ClassModificationAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType(
      "classModification",
      this.syntaxNode,
    );
    for (const argumentNode of syntaxNode.childrenForFieldName("argument")) {
      const argument = ArgumentAbstractSyntax.new(argumentNode);
      if (argument != null) this.arguments.push(argument);
    }
  }
}

export abstract class ArgumentAbstractSyntax extends AbstractSyntax {
  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
  }

  static new(syntaxNode: SyntaxNode | null): ArgumentAbstractSyntax | null {
    switch (syntaxNode?.type) {
      case "elementModification":
        return new ElementModificationAbstractSyntax(syntaxNode);
      default:
        return null;
    }
  }
}

export class ElementModificationAbstractSyntax extends AbstractSyntax {
  descriptionString: DescriptionStringAbstractSyntax | null = null;
  modification: ModificationAbstractSyntax | null = null;
  name: NameAbstractSyntax | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): ElementModificationAbstractSyntax | null {
    if (syntaxNode?.type != "elementModification") return null;
    return new ElementModificationAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType(
      "elementModification",
      this.syntaxNode,
    );
    this.descriptionString = DescriptionStringAbstractSyntax.new(
      syntaxNode.childForFieldName("descriptionString"),
    );
    this.modification = ModificationAbstractSyntax.new(
      syntaxNode.childForFieldName("modification"),
    );
    this.name = NameAbstractSyntax.new(syntaxNode.childForFieldName("name"));
  }
}

// A.2.6 Equations

export class ForIndexAbstractSyntax extends AbstractSyntax {
  expression: ExpressionAbstractSyntax | null = null;
  identifier: IdentifierAbstractSyntax | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(syntaxNode: SyntaxNode | null): ForIndexAbstractSyntax | null {
    if (syntaxNode?.type != "forIndex") return null;
    return new ForIndexAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType("forIndex", this.syntaxNode);
    this.expression = ExpressionAbstractSyntax.new(
      syntaxNode.childForFieldName("expression"),
    );
    this.identifier = IdentifierAbstractSyntax.new(
      syntaxNode.childForFieldName("identifier"),
    );
  }
}

// A.2.7 Expressions

export abstract class ExpressionAbstractSyntax extends AbstractSyntax {
  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
  }

  static new(syntaxNode: SyntaxNode | null): ExpressionAbstractSyntax | null {
    switch (syntaxNode?.type) {
      case "arrayConstructor":
        return new ArrayConstructorAbstractSyntax(syntaxNode);
      case "binaryExpression":
        return new BinaryExpressionAbstractSyntax(syntaxNode);
      case "logicalLiteral":
        return new LogicalLiteralAbstractSyntax(syntaxNode);
      case "stringLiteral":
        return new StringLiteralAbstractSyntax(syntaxNode);
      case "unaryExpression":
        return new UnaryExpressionAbstractSyntax(syntaxNode);
      case "unsignedIntegerLiteral":
        return new UnsignedIntegerLiteralAbstractSyntax(syntaxNode);
      case "unsignedRealLiteral":
        return new UnsignedRealLiteralAbstractSyntax(syntaxNode);
      default:
        return null;
    }
  }
}

export abstract class SimpleExpressionAbstractSyntax extends ExpressionAbstractSyntax {
  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): SimpleExpressionAbstractSyntax | null {
    switch (syntaxNode?.type) {
      case "arrayConstructor":
        return new ArrayConstructorAbstractSyntax(syntaxNode);
      case "binaryExpression":
        return new BinaryExpressionAbstractSyntax(syntaxNode);
      case "logicalLiteral":
        return new LogicalLiteralAbstractSyntax(syntaxNode);
      case "stringLiteral":
        return new StringLiteralAbstractSyntax(syntaxNode);
      case "unaryExpression":
        return new UnaryExpressionAbstractSyntax(syntaxNode);
      case "unsignedIntegerLiteral":
        return new UnsignedIntegerLiteralAbstractSyntax(syntaxNode);
      case "unsignedRealLiteral":
        return new UnsignedRealLiteralAbstractSyntax(syntaxNode);
      default:
        return null;
    }
  }
}

export class BinaryExpressionAbstractSyntax extends SimpleExpressionAbstractSyntax {
  operand1: SimpleExpressionAbstractSyntax | null = null;
  operand2: SimpleExpressionAbstractSyntax | null = null;
  operator: BinaryOperator | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): BinaryExpressionAbstractSyntax | null {
    if (syntaxNode?.type != "binaryExpression") return null;
    return new BinaryExpressionAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType(
      "binaryExpression",
      this.syntaxNode,
    );
    this.operand1 = SimpleExpressionAbstractSyntax.new(
      syntaxNode.childForFieldName("operand1"),
    );
    this.operand2 = SimpleExpressionAbstractSyntax.new(
      syntaxNode.childForFieldName("operand2"),
    );
    switch (syntaxNode.childForFieldName("operator")?.text) {
      case "+":
        this.operator = BinaryOperator.ADD;
    }
  }
}

export class UnaryExpressionAbstractSyntax extends SimpleExpressionAbstractSyntax {
  operand: SimpleExpressionAbstractSyntax | null = null;
  operator: UnaryOperator | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): UnaryExpressionAbstractSyntax | null {
    if (syntaxNode?.type != "unaryExpression") return null;
    return new UnaryExpressionAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType("unaryExpression", this.syntaxNode);
    this.operand = SimpleExpressionAbstractSyntax.new(
      syntaxNode.childForFieldName("operand"),
    );
    switch (syntaxNode.childForFieldName("operator")?.text) {
      case "NOT":
        this.operator = UnaryOperator.LOGICAL_NOT;
      case "+":
        this.operator = UnaryOperator.PLUS;
      case "-":
        this.operator = UnaryOperator.MINUS;
    }
  }
}

export abstract class PrimaryExpressionAbstractSyntax extends SimpleExpressionAbstractSyntax {
  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): PrimaryExpressionAbstractSyntax | null {
    switch (syntaxNode?.type) {
      case "arrayConstructor":
        return new ArrayConstructorAbstractSyntax(syntaxNode);
      case "logicalLiteral":
        return new LogicalLiteralAbstractSyntax(syntaxNode);
      case "stringLiteral":
        return new StringLiteralAbstractSyntax(syntaxNode);
      case "unsignedIntegerLiteral":
        return new UnsignedIntegerLiteralAbstractSyntax(syntaxNode);
      case "unsignedRealLiteral":
        return new UnsignedRealLiteralAbstractSyntax(syntaxNode);
      default:
        return null;
    }
  }
}

export class ArrayConstructorAbstractSyntax extends PrimaryExpressionAbstractSyntax {
  elements: ExpressionAbstractSyntax[] = [];
  forIndicies: ForIndexAbstractSyntax[] = [];

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): ArrayConstructorAbstractSyntax | null {
    if (syntaxNode?.type != "arrayConstructor") return null;
    return new ArrayConstructorAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType(
      "arrayConstructor",
      this.syntaxNode,
    );
    for (const elementNode of syntaxNode.childrenForFieldName("element")) {
      const element = ExpressionAbstractSyntax.new(elementNode);
      if (element != null) this.elements.push(element);
    }
    for (const forIndexNode of syntaxNode.childrenForFieldName("forIndex")) {
      const forIndex = ForIndexAbstractSyntax.new(forIndexNode);
      if (forIndex != null) this.forIndicies.push(forIndex);
    }
  }
}

export abstract class LiteralAbstractSyntax extends PrimaryExpressionAbstractSyntax {
  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
  }

  static new(syntaxNode: SyntaxNode | null): LiteralAbstractSyntax | null {
    switch (syntaxNode?.type) {
      case "logicalLiteral":
        return new LogicalLiteralAbstractSyntax(syntaxNode);
      case "stringLiteral":
        return new StringLiteralAbstractSyntax(syntaxNode);
      case "unsignedIntegerLiteral":
        return new UnsignedIntegerLiteralAbstractSyntax(syntaxNode);
      case "unsignedRealLiteral":
        return new UnsignedRealLiteralAbstractSyntax(syntaxNode);
      default:
        return null;
    }
  }
}

export abstract class UnsignedNumberLiteralAbstractSyntax extends LiteralAbstractSyntax {
  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): UnsignedNumberLiteralAbstractSyntax | null {
    switch (syntaxNode?.type) {
      case "unsignedIntegerLiteral":
        return new UnsignedIntegerLiteralAbstractSyntax(syntaxNode);
      case "unsignedRealLiteral":
        return new UnsignedRealLiteralAbstractSyntax(syntaxNode);
      default:
        return null;
    }
  }
}

export class UnsignedIntegerLiteralAbstractSyntax extends UnsignedNumberLiteralAbstractSyntax {
  value: number | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): UnsignedIntegerLiteralAbstractSyntax | null {
    if (syntaxNode?.type != "unsignedIntegerLiteral") return null;
    return new UnsignedIntegerLiteralAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType(
      "unsignedIntegerLiteral",
      this.syntaxNode,
    );
    this.value = parseInt(syntaxNode.text);
  }
}

export class UnsignedRealLiteralAbstractSyntax extends UnsignedNumberLiteralAbstractSyntax {
  value: number | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): UnsignedRealLiteralAbstractSyntax | null {
    if (syntaxNode?.type != "unsignedRealLiteral") return null;
    return new UnsignedRealLiteralAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType(
      "unsignedRealLiteral",
      this.syntaxNode,
    );
    this.value = parseFloat(syntaxNode.text);
  }
}

export class StringLiteralAbstractSyntax extends UnsignedNumberLiteralAbstractSyntax {
  value: string | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): StringLiteralAbstractSyntax | null {
    if (syntaxNode?.type != "stringLiteral") return null;
    return new StringLiteralAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType("stringLiteral", this.syntaxNode);
    this.value = syntaxNode.text.substring(1, syntaxNode.text.length - 1);
  }
}

export class LogicalLiteralAbstractSyntax extends LiteralAbstractSyntax {
  value: boolean | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): LogicalLiteralAbstractSyntax | null {
    if (syntaxNode?.type != "logicalLiteral") return null;
    return new LogicalLiteralAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType("logicalLiteral", this.syntaxNode);
    if (syntaxNode.text == "false") this.value = false;
    else if (syntaxNode.text == "true") this.value = true;
  }
}

export class TypeSpecifierAbstractSyntax extends AbstractSyntax {
  global: boolean = false;
  name: NameAbstractSyntax | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): TypeSpecifierAbstractSyntax | null {
    if (syntaxNode?.type != "typeSpecifier") return null;
    return new TypeSpecifierAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType("typeSpecifier", this.syntaxNode);
    this.global = syntaxNode.childForFieldName("global") != null;
    this.name = NameAbstractSyntax.new(syntaxNode.childForFieldName("name"));
  }
}

export class NameAbstractSyntax extends AbstractSyntax {
  identifier: IdentifierAbstractSyntax | null = null;
  qualifier: NameAbstractSyntax | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(syntaxNode: SyntaxNode | null): NameAbstractSyntax | null {
    if (syntaxNode?.type != "name") return null;
    return new NameAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType("name", this.syntaxNode);
    this.identifier = IdentifierAbstractSyntax.new(
      syntaxNode.childForFieldName("identifier"),
    );
    this.qualifier = NameAbstractSyntax.new(
      syntaxNode.childForFieldName("qualifier"),
    );
  }
}

export class DescriptionStringAbstractSyntax extends AbstractSyntax {
  value: string | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): DescriptionStringAbstractSyntax | null {
    if (syntaxNode?.type != "descriptionString") return null;
    return new DescriptionStringAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType(
      "descriptionString",
      this.syntaxNode,
    );
    this.value = "";
    for (const value of syntaxNode.childrenForFieldName("value"))
      this.value += value.text.slice(1, value.text.length - 1);
  }
}

export class AnnotationClauseAbstractSyntax extends AbstractSyntax {
  classModification: ClassModificationAbstractSyntax | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(
    syntaxNode: SyntaxNode | null,
  ): AnnotationClauseAbstractSyntax | null {
    if (syntaxNode?.type != "annotationClause") return null;
    return new AnnotationClauseAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType(
      "annotationClause",
      this.syntaxNode,
    );
    this.classModification = ClassModificationAbstractSyntax.new(
      syntaxNode.childForFieldName("classModification"),
    );
  }
}

export class IdentifierAbstractSyntax extends AbstractSyntax {
  value: string | null = null;

  constructor(syntaxNode?: SyntaxNode) {
    super(syntaxNode);
    if (this.syntaxNode != null) this.parse();
  }

  static new(syntaxNode: SyntaxNode | null): IdentifierAbstractSyntax | null {
    if (syntaxNode?.type != "IDENT") return null;
    return new IdentifierAbstractSyntax(syntaxNode);
  }

  override parse(): void {
    const syntaxNode = assertSyntaxNodeType("IDENT", this.syntaxNode);
    this.value = syntaxNode.text;
  }
}

export enum ClassKind {
  BLOCK,
  CLASS,
  MODEL,
  PACKAGE,
}

export enum BinaryOperator {
  ADD,
}

export enum UnaryOperator {
  LOGICAL_NOT = "not",
  MINUS = "-",
  PLUS = "+",
}
