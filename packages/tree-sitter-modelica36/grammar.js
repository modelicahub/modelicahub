module.exports = grammar({
  name: 'modelica36',
  extras: $ => [
    /\s|\\\r?\n/,
    $.COMMENT,
  ],
  word: $ => $.IDENT,
  rules: {

    // A.2.1 Stored Definition – Within

    storedDefinition: $ => seq(
      optional($.BOM),
      optional(field('withinClause', $.withinClause)),
      repeat(seq(field('classDefinition', $.classDefinition), ';'))
    ),

    withinClause: $ => seq('within', optional(field('packagePrefixName', $.name)), ';'),

    // A.2.2 Class Definition

    classDefinition: $ => seq(
      field('classPrefixes', $.classPrefixes),
      field('classSpecifier', $._classSpecifier)
    ),

    classPrefixes: $ => seq(
      choice(
        field('block', 'block'),
        field('class', 'class'),
        field('model', 'model'),
        field('package', 'package')
      )
    ),

    _classSpecifier: $ => choice(
      $.longClassSpecifier
    ),

    longClassSpecifier: $ => seq(
      field('identifier', $.IDENT),
      optional(field('descriptionString', $.descriptionString)),
      optional(field('elementList', $.elementList)),
      optional(seq(field('annotationClause', $.annotationClause), ';')),
      'end',
      field('endIdentifier', $.IDENT)
    ),

    elementList: $ => repeat1(
      seq(field('element', $._element), ';')
    ),

    _element: $ => choice(
      $.extendsClause,
      $.namedElement
    ),

    namedElement: $ => seq(
      choice(
        field('classDefinition', $.classDefinition),
        field('componentClause', $.componentClause)
      )
    ),

    // A.2.3 Extends

    extendsClause: $ => seq(
      'extends',
      field('typeSpecifier', $.typeSpecifier)
    ),

    // A.2.4 Component Clause

    componentClause: $ => seq(
      field('typeSpecifier', $.typeSpecifier),
      field('componentDeclaration', $.componentDeclaration),
      repeat(seq(',', field('componentDeclaration', $.componentDeclaration)))
    ),

    componentDeclaration: $ => seq(
      field('identifier', $.IDENT),
      optional(field('modification', $.modification)),
      optional(field('descriptionString', $.descriptionString)),
      optional(field('annotationClause', $.annotationClause))
    ),

    // A.2.5 Modification

    modification: $ => choice(
      seq(field('classModification', $.classModification), optional(seq('=', field('modificationExpression', $.modificationExpression)))),
      seq(choice('=', ':='), field('modificationExpression', $.modificationExpression))
    ),

    modificationExpression: $ => choice(
      field('expression', $._expression),
      'break'
    ),

    classModification: $ => seq(
      '(', optional(seq(field('argument', $._argument), repeat(seq(',', field('argument', $._argument))))), ')'
    ),

    _argument: $ => choice(
      $.elementModification
    ),

    elementModification: $ => seq(
      field('name', $.name), optional(field('modification', $.modification)), optional(field('descriptionString', $.descriptionString))
    ),

    // A.2.6 Equations

    forIndex: $ => seq(
      field('identifier', $.IDENT), optional(seq('in', field('expression', $._expression)))
    ),

    // A.2.7 Expressions

    _expression: $ => choice(
      $._simpleExpression,
    ),

    _simpleExpression: $ => choice(
      $.unaryExpression,
      $.binaryExpression,
      $._primaryExpression
    ),

    unaryExpression: $ => prec(7, choice(
      seq(field("operator", "not"), field("operand", $._simpleExpression)),
      seq(field("operator", "+"), field("operand", $._simpleExpression)),
      seq(field("operator", "-"), field("operand", $._simpleExpression))
    )),

    binaryExpression: $ => choice(
      prec.left(4, seq(field('operand1', $._simpleExpression), field('operator', '+'), field('operand2', $._simpleExpression))),
    ),

    _primaryExpression: $ => choice(
      $._literal,
      $.arrayConstructor
    ),

    _literal: $ => choice(
      $._unsignedNumberLiteral,
      $.stringLiteral,
      $.logicalLiteral
    ),

    _unsignedNumberLiteral: $ => choice(
      $.unsignedIntegerLiteral,
      $.unsignedRealLiteral
    ),

    unsignedIntegerLiteral: $ => $.UNSIGNED_INTEGER,

    unsignedRealLiteral: $ => $.UNSIGNED_REAL,

    stringLiteral: $ => $.STRING,

    logicalLiteral: $ => choice('false', 'true'),

    arrayConstructor: $ => seq(
      '{', field('element', $._expression), optional(choice(repeat1(seq(',', field('element', $._expression))), seq('for', field('forIndex', $.forIndex), repeat(seq(',', field('forIndex', $.forIndex)))))), '}'
    ),

    typeSpecifier: $ => seq(
      optional(field('global', '.')), field('name', $.name)
    ),

    name: $ => prec.left(choice(
      seq(field('qualifier', $.name), '.', field('identifier', $.IDENT)),
      field('identifier', $.IDENT)
    )),

    descriptionString: $ => seq(
      field('value', $.STRING), repeat(seq('+', field('value', $.STRING)))
    ),

    annotationClause: $ => seq(
      'annotation', field('classModification', $.classModification)
    ),

    // A.1 Lexical conventions

    BOM: $ => /\u00EF\u00BB\u00BF/,

    IDENT: $ => token(choice(
      seq(/[_a-zA-Z]/, repeat(choice(/[0-9]/, /[_a-zA-Z]/))),
      seq('’', repeat(choice(
        /[_a-zA-Z]/, /[0-9]/, '!', '#', '$', '%', '&', '(', ')',
        '*', '+', ',', '-', '.', '/', ':', ';', '<', '>', '=',
        '?', '@', '[', ']', '^', '{', '}', '|', '~', ' ', '\'',
        seq('\\', choice('’', '\'', '"', '?', '\\', 'a', 'b', 'f', 'n', 'r', 't', 'v')))), '’'))),

    STRING: $ => token(seq('"', repeat(choice(/[^"\\]/,
      seq('\\', choice('’', '\'', '"', '?', '\\', 'a', 'b', 'f', 'n', 'r', 't', 'v')))), '"')),

    UNSIGNED_INTEGER: $ => /[0-9]+/,

    UNSIGNED_REAL: $ => token(choice(
      seq(/[0-9]+/, ".", optional(/[0-9]+/)),
      seq(/[0-9]+/, optional(seq(".", optional(/[0-9]+/))), choice("e", "E"), optional(choice("+", "-")), /[0-9]+/),
      seq(".", /[0-9]+/, optional(seq(choice("e", "E"), optional(choice("+", "-")), /[0-9]+/)))
    )),

    // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
    COMMENT: _ => token(choice(
      seq('//', /(\\+(.|\r?\n)|[^\\\n])*/),
      seq(
        '/*',
        /[^*]*\*+([^/*][^*]*\*+)*/,
        '/',
      ),
    )),

  }
});