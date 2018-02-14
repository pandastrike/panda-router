"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.destructure = undefined;

var _pandaGrammar = require("panda-grammar");

var _fairmontMultimethods = require("fairmont-multimethods");

var $all, assign, define, destructure, hasModifier, ignore, isArray, isEither, isExpanded, isModifier, isNotModified, isObject, isOperator, isPath, isQuery, isString, spread;

({ isString, isArray, isObject } = require("fairmont-helpers"));

// rule to take x=y and return x: y
assign = function (p) {
  return (0, _pandaGrammar.rule)(p, function ({
    value: [lhs,, rhs]
  }) {
    return {
      [lhs]: rhs
    };
  });
};

// we ignore by returning an empty merge object
ignore = function (p) {
  return (0, _pandaGrammar.rule)(p, function () {
    return {};
  });
};

isOperator = function (op) {
  return function (operator) {
    return operator === op;
  };
};

isPath = isOperator("/");

isQuery = isOperator("?");

isEither = isOperator(void 0);

hasModifier = function (variable) {
  return isObject(variable) && (variable != null ? variable.modifier : void 0) != null;
};

isModifier = function (modifier) {
  return function (variable) {
    return isObject(variable) && variable.modifier === modifier;
  };
};

isExpanded = isModifier("*");

isNotModified = isModifier(void 0);

// TODO: get rid of the need for this
// along with the multiple levels of merge all / $all below
spread = function (f) {
  return function (ax) {
    return f(...ax);
  };
};

$all = spread(_pandaGrammar.all);

({ define } = _fairmontMultimethods.Method);

exports.destructure = destructure = _fairmontMultimethods.Method.create({
  default: function () {
    throw `expected destructuring error: ${arguments}`;
  }
});

// Known error conditions
define(destructure, isEither, hasModifier, function () {
  throw "unsupported modifier: requires operation";
});

define(destructure, isString, hasModifier, function (operator, { modifier }) {
  throw `unsupported modifier: ${modifier}`;
});

define(destructure, isString, isArray, function (operator) {
  throw `unsupported operator: ${operator}`;
});

// Top-level invocation
define(destructure, isArray, function (expressions) {
  return (0, _pandaGrammar.grammar)((0, _pandaGrammar.merge)($all(function () {
    var expression, i, len, results;
    results = [];
    for (i = 0, len = expressions.length; i < len; i++) {
      expression = expressions[i];
      results.push(destructure(expression));
    }
    return results;
  }())));
});

// String literals
define(destructure, isString, function (expression) {
  return ignore((0, _pandaGrammar.string)(expression));
});

// Expression: delegate to specializations
define(destructure, isObject, function ({ operator, variables }) {
  return destructure(operator, variables);
});

// Operations: path, query, and generic
define(destructure, isPath, isArray, function (operator, variables) {
  return (0, _pandaGrammar.merge)((0, _pandaGrammar.all)(ignore((0, _pandaGrammar.string)("/")), (0, _pandaGrammar.merge)($all(function () {
    var i, len, results, variable;
    results = [];
    for (i = 0, len = variables.length; i < len; i++) {
      variable = variables[i];
      results.push(destructure(operator, variable));
    }
    return results;
  }()))));
});

define(destructure, isQuery, isArray, function (operator, variables) {
  return (0, _pandaGrammar.merge)((0, _pandaGrammar.all)(ignore((0, _pandaGrammar.string)("?")), (0, _pandaGrammar.merge)($all(function () {
    var i, len, results, variable;
    results = [];
    for (i = 0, len = variables.length; i < len; i++) {
      variable = variables[i];
      results.push(destructure(operator, variable));
    }
    return results;
  }()))));
});

define(destructure, isEither, isArray, function (operator, variables) {
  return (0, _pandaGrammar.merge)($all(function () {
    var i, len, results, variable;
    results = [];
    for (i = 0, len = variables.length; i < len; i++) {
      variable = variables[i];
      results.push(destructure(operator, variable));
    }
    return results;
  }()));
});

// Variable evaluation for paths: not modified and expanded
define(destructure, isPath, isNotModified, function (operator, { name }) {
  return (0, _pandaGrammar.merge)((0, _pandaGrammar.all)((0, _pandaGrammar.tag)(name, _pandaGrammar.word), ignore((0, _pandaGrammar.optional)((0, _pandaGrammar.string)("/")))));
});

define(destructure, isPath, isExpanded, function (operator, { name }) {
  return (0, _pandaGrammar.tag)(name, (0, _pandaGrammar.list)((0, _pandaGrammar.string)("/"), _pandaGrammar.word));
});

// Variable evaluation for queries: not modified and expanded
define(destructure, isQuery, isNotModified, function (operator, { name }) {
  return (0, _pandaGrammar.merge)((0, _pandaGrammar.all)(assign((0, _pandaGrammar.all)((0, _pandaGrammar.string)(name), (0, _pandaGrammar.string)("="), _pandaGrammar.word)), ignore((0, _pandaGrammar.optional)((0, _pandaGrammar.string)("&")))));
});

define(destructure, isQuery, isExpanded, function (operator, { name }) {
  return (0, _pandaGrammar.tag)(name, (0, _pandaGrammar.merge)((0, _pandaGrammar.list)((0, _pandaGrammar.string)("&"), assign((0, _pandaGrammar.all)(_pandaGrammar.word, (0, _pandaGrammar.string)("="), _pandaGrammar.word)))));
});

// Variable evaluation, generic case: not modified only
define(destructure, isEither, isNotModified, function (operator, { name }) {
  return (0, _pandaGrammar.tag)(name, _pandaGrammar.word);
});

exports.destructure = destructure;