import {re, string, list, all, any, optional,
  rule, tag, merge, grammar} from "panda-grammar"

import {push, isString, isArray, isObject, generic} from "@dashkite/joy"

log = (p) ->
  (input) ->
    output = p input
    console.log {input, output}
    output

# from https://tools.ietf.org/html/rfc3986#section-3.3
# and https://tools.ietf.org/html/rfc3986#section-3.4

component = (p) ->
  (s) ->
    if (m = p s)?
      value: (decodeURIComponent m.value), rest: m.rest

pathComponent = component re /^[\w\-\.\~\%\!\$\&\'\(\)\*\+\,\;\=\:\@]+/
# we don't include & and = because we're parsing the parameter value here
queryComponent = component re /^[\w\-\.\~\%\!\$\'\(\)\*\+\,\;\:\@\/\?]+/

word = re /^\w+/

# set - like many, but in any order
set = (px...) ->
  (s) ->
    values = []
    qx = [ px... ]
    rx = []
    while qx.length > 0
      for p in qx
        m = p s
        if m?
          push values, m.value
          s = m.rest
        else
          push rx, p
      # confirm that we matched at least one p
      # (otw we get an infinite loop)
      if qx.length > rx.length
        qx = rx
        rx = []
      else
        break
    if values.length > 0
      value: values, rest: s

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

destructure = generic
  name: "destructure"
  description: "Destructures URL template"

# Known error conditions

generic destructure, isEither, hasModifier, ->
  throw "unsupported modifier: requires operation"

generic destructure, isString, hasModifier, (operator, {modifier}) ->
  throw "unsupported modifier: #{modifier}"

generic destructure, isString, isArray, (operator) ->
  throw "unsupported operator: #{operator}"

# Top-level invocation

generic destructure, isArray, (expressions) ->
  grammar merge $all do ->
    for expression in expressions
      destructure expression

# String literals

generic destructure, isString, (expression) -> ignore string expression

# Expression: delegate to specializations

generic destructure, isObject, ({operator, variables}) ->
  destructure operator, variables

# Operations: path, query, and generic

generic destructure, isPath, isArray, (operator, variables) ->
  merge all (ignore string "/"),
    merge $all do ->
      for variable in variables
        destructure operator, variable

generic destructure, isQuery, isArray, (operator, variables) ->
  merge fallback [{}], optional all (ignore string "?"),
    merge $set do ->
      for variable in variables
        destructure operator, variable

generic destructure, isEither, isArray, (operator, variables) ->
  merge $all do ->
    for variable in variables
      destructure operator, variable

# Variable evaluation for paths: not modified and expanded

generic destructure, isPath, isNotModified, (operator, {name}) ->
  merge all (tag name, pathComponent), (ignore optional string "/")

generic destructure, isPath, isExpanded, (operator, {name}) ->
  tag name, (list (string "/"), pathComponent)

# Variable evaluation for queries: not modified and expanded
assignment = (p) ->
  assign (all p, (string "="), (optional queryComponent))

generic destructure, isQuery, isNotModified, (operator, {name}) ->
  merge all (assignment string name), (ignore optional string "&")

generic destructure, isQuery, isExpanded, (operator, {name}) ->
  tag name, merge list (string "&"), (assignment queryComponent)


# Variable evaluation, generic case: not modified only

generic destructure, isEither, isNotModified, (operator, {name}) ->
  tag name, pathComponent

export {destructure}
