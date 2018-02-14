"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testParser = undefined;

var _powerAssertRecorder = function () { function PowerAssertRecorder() { this.captured = []; } PowerAssertRecorder.prototype._capt = function _capt(value, espath) { this.captured.push({ value: value, espath: espath }); return value; }; PowerAssertRecorder.prototype._expr = function _expr(value, source) { var capturedValues = this.captured; this.captured = []; return { powerAssertContext: { value: value, events: capturedValues }, source: source }; }; return PowerAssertRecorder; }();

var _powerAssert = require("power-assert");

var _powerAssert2 = _interopRequireDefault(_powerAssert);

var _index = require("../src/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var testParser;

exports.testParser = testParser = function (test) {
  var $pass;
  $pass = function (template, expected) {
    return test(template, function () {
      var _rec = new _powerAssertRecorder(),
          _rec2 = new _powerAssertRecorder();

      return _powerAssert2.default.deepEqual(_rec._expr(_rec._capt(expected, "arguments/0"), {
        content: "assert.deepEqual(expected, parse(template))",
        filepath: "parse.coffee",
        line: 8
      }), _rec2._expr(_rec2._capt((0, _index.parse)(_rec2._capt(template, "arguments/1/arguments/0")), "arguments/1"), {
        content: "assert.deepEqual(expected, parse(template))",
        filepath: "parse.coffee",
        line: 8
      }));
    });
  };
  return [$pass("/foo/bar?baz=42", ["/foo/bar?baz=42"]), $pass("/{foo}/bar?baz=42", ["/", {
    variables: [{
      name: "foo"
    }]
  }, "/bar?baz=42"]), $pass("/foo{/bar}?baz=42", ["/foo", {
    operator: "/",
    variables: [{
      name: "bar"
    }]
  }, "?baz=42"]), $pass("/foo{/bar*}?baz=42", ["/foo", {
    operator: "/",
    variables: [{
      name: "bar",
      modifier: "*"
    }]
  }, "?baz=42"]), $pass("{/foo,bar}?baz=42", [{
    operator: "/",
    variables: [{
      name: "foo"
    }, {
      name: "bar"
    }]
  }, "?baz=42"]), $pass("{/foo,bar*}?baz=42", [{
    operator: "/",
    variables: [{
      name: "foo"
    }, {
      name: "bar",
      modifier: "*"
    }]
  }, "?baz=42"]), $pass("/foo/bar?baz={baz}", ["/foo/bar?baz=", {
    variables: [{
      name: "baz"
    }]
  }]), $pass("/foo/bar{?baz}", ["/foo/bar", {
    operator: "?",
    variables: [{
      name: "baz"
    }]
  }]), $pass("/foo/bar{?baz*}", ["/foo/bar", {
    operator: "?",
    variables: [{
      name: "baz",
      modifier: "*"
    }]
  }])];
};

exports.testParser = testParser;