"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = undefined;

var _pandaGrammar = require("panda-grammar");

var expression, literal, operator, parse, template, variable, variables;

// we'll ignore all but the / and ? operators for now
operator = (0, _pandaGrammar.tag)("operator", (0, _pandaGrammar.any)((0, _pandaGrammar.string)("/"), (0, _pandaGrammar.string)("?")));

// we'll ignore :\d+ for now as well
variable = (0, _pandaGrammar.merge)((0, _pandaGrammar.all)((0, _pandaGrammar.tag)("name", (0, _pandaGrammar.re)(/^\w+/)), (0, _pandaGrammar.optional)((0, _pandaGrammar.tag)("modifier", (0, _pandaGrammar.string)("*")))));

variables = (0, _pandaGrammar.tag)("variables", (0, _pandaGrammar.list)((0, _pandaGrammar.string)(","), variable));

expression = (0, _pandaGrammar.merge)((0, _pandaGrammar.between)((0, _pandaGrammar.string)("{"), (0, _pandaGrammar.string)("}"), (0, _pandaGrammar.all)((0, _pandaGrammar.optional)(operator), variables)));

// limited set of possible characters
literal = (0, _pandaGrammar.join)((0, _pandaGrammar.many)((0, _pandaGrammar.any)((0, _pandaGrammar.re)(/^\w+/), (0, _pandaGrammar.string)("/"), (0, _pandaGrammar.string)("."), (0, _pandaGrammar.string)("?"), (0, _pandaGrammar.string)("&"), (0, _pandaGrammar.string)("="))));

template = (0, _pandaGrammar.many)((0, _pandaGrammar.any)(literal, expression));

exports.parse = parse = (0, _pandaGrammar.grammar)(template);

exports.parse = parse;