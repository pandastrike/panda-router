"use strict";

var _amen = require("amen");

var _parse = require("./parse");

var _destructure = require("./destructure");

var _router = require("./router");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_asyncToGenerator(function* () {
  return (0, _amen.print)((yield (0, _amen.test)("Panda Router", [(0, _amen.test)("Template Parser", (0, _parse.testParser)(_amen.test)), (0, _amen.test)("Destructuring", (0, _destructure.testDestructure)(_amen.test)), (0, _amen.test)("Router", (0, _router.testRouter)(_amen.test))])));
})();