import {parse} from "./parse"
import {destructure} from "./destructure"

class Route

  @create: (description) -> new Route description

  constructor: ({@template, @data}) ->
    @match = destructure parse @template

class Router

  @create: -> new Router

  constructor: -> @routes = []

  add: (route) -> @routes.push Route.create route

  match: (url) ->
    for {match,data} in @routes
      if (bindings = match url)?
        return {data,bindings}
    return undefined

export {Router}
