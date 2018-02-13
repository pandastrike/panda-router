import {re, string, list, between, all, any, many, optional,
  tag, merge, join, grammar} from "panda-grammar"

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

export {parse}
