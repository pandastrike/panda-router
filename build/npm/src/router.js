"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Router = undefined;

var _parse = require("./parse");

var _destructure = require("./destructure");

var Route, Router;

Route = class Route {
  static create(description) {
    return new Route(description);
  }

  constructor({
    template,
    data: data1
  }) {
    this.data = data1;
    this.match = (0, _destructure.destructure)((0, _parse.parse)(template));
  }

};

exports.Router = Router = class Router {
  static create() {
    return new Router();
  }

  constructor() {
    this.routes = [];
  }

  add(route) {
    return this.routes.push(Route.create(route));
  }

  match(url) {
    var bindings, data, i, len, match, ref;
    ref = this.routes;
    for (i = 0, len = ref.length; i < len; i++) {
      ({ match, data } = ref[i]);
      if ((bindings = match(url)) != null) {
        return { data, bindings };
      }
    }
    return void 0;
  }

};

exports.Router = Router;