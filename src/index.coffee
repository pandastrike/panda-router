import {re, string, word, list, between, all, any, many, optional,
  rule, tag, merge, join, grammar} from "panda-grammar"

{isObject, isString} = require "fairmont-helpers"

# we'll ignore all but the / and ? operators for now
operator = tag "operator", (any (string "/"), (string "?"))
# we'll ignore :\d+ for now as well
variable = merge all (tag "name", (re /^\w+/)),
  (optional (tag "modifier", string "*"))
variables = tag "variables", list (string ","), variable
expression = merge between (string "{"), (string "}"),
  (all (optional operator), variables)
# limited set of possible characters
literal = join many any (re /^\w+/), (string "/"), (string "."),
  (string "?"), (string "&"), (string "=")
template = many any literal, expression
parse = grammar template

# rule to take x=y and return x: y
assign = (p) -> rule p, ({value: [lhs, ,rhs]}) -> [lhs]: rhs
  # we ignore by returning an empty merge object
ignore = (p) -> rule p, (-> {})

# we'll convert this to use generics once we have it working
destructure = (expressions) ->
  px = []
  for expression in expressions
    if isString expression
      px.push ignore string expression
    else if isObject expression
      {operator, variables} = expression
      switch operator
        when "/" then px.push ignore string "/"
        when "?" then px.push ignore string "?"
        when undefined then ;;
        else
          throw "unsupported operator: #{operator}"
      for variable in variables
        {name, modifier} = variable
        switch operator
          when "/"
            switch modifier
              when "*"
                px.push tag name, (list (string "/"), word)
              when undefined
                px.push tag name, word
                px.push ignore optional string "/"
              else
                throw "unsupported modifier: #{modifier}"
          when "?"
            switch modifier
              when "*"
                px.push tag name,
                  merge list (string "&"),
                    (assign (all word, (string "="), word))
              when undefined
                px.push assign (all (string name), (string "="), word)
                px.push ignore optional string "&"
              else
                throw "unsupported modifier: #{modifier}"
          when undefined
            if !modifier?
              px.push tag name, word
            else
              throw "modifiers without operations are unsupported"
  grammar merge all px...

module.exports = {parse, destructure}
