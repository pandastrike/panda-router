import {re, string, list, all, optional,
  rule, tag, merge, grammar} from "panda-grammar"

{push, isString, isArray, isObject} = require "fairmont-helpers"
import {Method} from "fairmont-multimethods"

# define word in this context
word = re /^[\w\-]+/

# set - like many, but in any order
set = (px...) ->
  (s) ->
    values = []
    qx = []
    while px.length > 0
      for p in px
        m = p s
        if m?
          push values, m.value
          s = m.rest
        else
          push qx p
      px = qx
      qx = []
    if values.length > 0
      value: values, rest: s

# rule to take x=y and return x: y
assign = (p) -> rule p, ({value: [lhs, ,rhs]}) -> [lhs]: rhs
  # we ignore by returning an empty merge object
ignore = (p) -> rule p, (-> {})
fallback = (value, p) ->
  (s) ->
    m = p s
    if m?.value?
      m
    else
      {value, rest: m.rest}

log = (p) ->
  (input) ->
    output = p input
    console.log {input, output}
    output

isOperator = (op) -> (operator) -> operator == op
isPath = isOperator "/"
isQuery = isOperator "?"
isEither = isOperator undefined
hasModifier = (variable) ->
  (isObject variable) && variable?.modifier?
isModifier = (modifier) -> (variable) ->
  (isObject variable) && variable.modifier == modifier
isExpanded = isModifier "*"
isNotModified = isModifier undefined

# TODO: get rid of the need for this
# along with the multiple levels of merge all / $all below
spread = (f) -> (ax) -> f ax...
$all = spread all
$set = spread set

{define} = Method
destructure = Method.create
  default: -> throw "expected destructuring error: #{arguments}"

# Known error conditions

define destructure, isEither, hasModifier, ->
  throw "unsupported modifier: requires operation"

define destructure, isString, hasModifier, (operator, {modifier}) ->
  throw "unsupported modifier: #{modifier}"

define destructure, isString, isArray, (operator) ->
  throw "unsupported operator: #{operator}"

# Top-level invocation

define destructure, isArray, (expressions) ->
  grammar merge $all do ->
    for expression in expressions
      destructure expression

# String literals

define destructure, isString, (expression) -> ignore string expression

# Expression: delegate to specializations

define destructure, isObject, ({operator, variables}) ->
  destructure operator, variables

# Operations: path, query, and generic

define destructure, isPath, isArray, (operator, variables) ->
  merge all (ignore string "/"),
    merge $all do ->
      for variable in variables
        destructure operator, variable

define destructure, isQuery, isArray, (operator, variables) ->
  merge fallback [{}], optional all (ignore string "?"),
    merge $set do ->
      for variable in variables
        destructure operator, variable

define destructure, isEither, isArray, (operator, variables) ->
  merge $all do ->
    for variable in variables
      destructure operator, variable

# Variable evaluation for paths: not modified and expanded

define destructure, isPath, isNotModified, (operator, {name}) ->
  merge all (tag name, word), (ignore optional string "/")

define destructure, isPath, isExpanded, (operator, {name}) ->
  tag name, (list (string "/"), word)

# Variable evaluation for queries: not modified and expanded

define destructure, isQuery, isNotModified, (operator, {name}) ->
  merge all (assign (all (string name), (string "="), word)),
    (ignore optional string "&")

define destructure, isQuery, isExpanded, (operator, {name}) ->
  tag name,
    merge list (string "&"), (assign (all word, (string "="), word))

# Variable evaluation, generic case: not modified only

define destructure, isEither, isNotModified, (operator, {name}) ->
  tag name, word

export {destructure}
