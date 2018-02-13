"use strict";

var _pandaGrammar = require("panda-grammar");

var assign, destructure, expression, ignore, isObject, isString, literal, operator, parse, template, variable, variables;

({ isObject, isString } = require("fairmont-helpers"));

// we'll ignore all but the / and ? operators for now
operator = (0, _pandaGrammar.tag)("operator", (0, _pandaGrammar.any)((0, _pandaGrammar.string)("/"), (0, _pandaGrammar.string)("?")));

// we'll ignore :\d+ for now as well
variable = (0, _pandaGrammar.merge)((0, _pandaGrammar.all)((0, _pandaGrammar.tag)("name", (0, _pandaGrammar.re)(/^\w+/)), (0, _pandaGrammar.optional)((0, _pandaGrammar.tag)("modifier", (0, _pandaGrammar.string)("*")))));

variables = (0, _pandaGrammar.tag)("variables", (0, _pandaGrammar.list)((0, _pandaGrammar.string)(","), variable));

expression = (0, _pandaGrammar.merge)((0, _pandaGrammar.between)((0, _pandaGrammar.string)("{"), (0, _pandaGrammar.string)("}"), (0, _pandaGrammar.all)((0, _pandaGrammar.optional)(operator), variables)));

// limited set of possible characters
literal = (0, _pandaGrammar.join)((0, _pandaGrammar.many)((0, _pandaGrammar.any)((0, _pandaGrammar.re)(/^\w+/), (0, _pandaGrammar.string)("/"), (0, _pandaGrammar.string)("."), (0, _pandaGrammar.string)("?"), (0, _pandaGrammar.string)("&"), (0, _pandaGrammar.string)("="))));

template = (0, _pandaGrammar.many)((0, _pandaGrammar.any)(literal, expression));

parse = (0, _pandaGrammar.grammar)(template);

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

// we'll convert this to use generics once we have it working
destructure = function (expressions) {
  var i, j, len, len1, modifier, name, px;
  console.log(JSON.stringify(expressions, null, 2));
  px = [];
  for (i = 0, len = expressions.length; i < len; i++) {
    expression = expressions[i];
    if (isString(expression)) {
      px.push(ignore((0, _pandaGrammar.string)(expression)));
    } else if (isObject(expression)) {
      ({ operator, variables } = expression);
      switch (operator) {
        case "/":
          px.push(ignore((0, _pandaGrammar.string)("/")));
          break;
        case "?":
          px.push(ignore((0, _pandaGrammar.string)("?")));
          break;
        case void 0:
          break;
        default:
          throw `unsupported operator: ${operator}`;
      }
      for (j = 0, len1 = variables.length; j < len1; j++) {
        variable = variables[j];
        ({ name, modifier } = variable);
        switch (operator) {
          case "/":
            switch (modifier) {
              case "*":
                px.push((0, _pandaGrammar.tag)(name, (0, _pandaGrammar.list)((0, _pandaGrammar.string)("/"), _pandaGrammar.word)));
                break;
              case void 0:
                px.push((0, _pandaGrammar.tag)(name, _pandaGrammar.word));
                px.push(ignore((0, _pandaGrammar.optional)((0, _pandaGrammar.string)("/"))));
                break;
              default:
                throw `unsupported modifier: ${modifier}`;
            }
            break;
          case "?":
            switch (modifier) {
              case "*":
                px.push((0, _pandaGrammar.tag)(name, (0, _pandaGrammar.merge)((0, _pandaGrammar.list)((0, _pandaGrammar.string)("&"), assign((0, _pandaGrammar.all)(_pandaGrammar.word, (0, _pandaGrammar.string)("="), _pandaGrammar.word))))));
                break;
              case void 0:
                px.push(assign((0, _pandaGrammar.all)((0, _pandaGrammar.string)(name), (0, _pandaGrammar.string)("="), _pandaGrammar.word)));
                px.push(ignore((0, _pandaGrammar.optional)((0, _pandaGrammar.string)("&"))));
                break;
              default:
                throw `unsupported modifier: ${modifier}`;
            }
            break;
          case void 0:
            if (modifier == null) {
              px.push((0, _pandaGrammar.tag)(name, _pandaGrammar.word));
            } else {
              throw "modifiers without operations are unsupported";
            }
        }
      }
    }
  }
  return (0, _pandaGrammar.grammar)((0, _pandaGrammar.merge)((0, _pandaGrammar.all)(...px)));
};

module.exports = { parse, destructure };