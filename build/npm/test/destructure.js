"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testDestructure = undefined;

var _powerAssertRecorder = function () { function PowerAssertRecorder() { this.captured = []; } PowerAssertRecorder.prototype._capt = function _capt(value, espath) { this.captured.push({ value: value, espath: espath }); return value; }; PowerAssertRecorder.prototype._expr = function _expr(value, source) { var capturedValues = this.captured; this.captured = []; return { powerAssertContext: { value: value, events: capturedValues }, source: source }; }; return PowerAssertRecorder; }();

var _powerAssert = require("power-assert");

var _powerAssert2 = _interopRequireDefault(_powerAssert);

var _index = require("../src/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var testDestructure;

exports.testDestructure = testDestructure = function (test) {
  var $pass;
  $pass = function (template, url, expected) {
    return test(`${template} : ${url}`, function () {
      var _rec = new _powerAssertRecorder(),
          _rec2 = new _powerAssertRecorder();

      var f;
      f = (0, _index.destructure)((0, _index.parse)(template));
      return _powerAssert2.default.deepEqual(_rec._expr(_rec._capt(f(_rec._capt(url, "arguments/0/arguments/0")), "arguments/0"), {
        content: "assert.deepEqual(f(url), expected)",
        filepath: "destructure.coffee",
        line: 9
      }), _rec2._expr(_rec2._capt(expected, "arguments/1"), {
        content: "assert.deepEqual(f(url), expected)",
        filepath: "destructure.coffee",
        line: 9
      }));
    });
  };
  return [$pass("/{foo}", "/abc", {
    foo: "abc"
  }), $pass("{/foo}", "/abc", {
    foo: "abc"
  }), $pass("/foo{?baz}", "/foo?baz=123", {
    baz: "123"
  }), $pass("{/foo,bar}", "/abc/def", {
    foo: "abc",
    bar: "def"
  }), $pass("{/foo*}", "/abc/def", {
    foo: ["abc", "def"]
  }), $pass("/foo{?bar,baz}", "/foo?bar=123&baz=456", {
    bar: "123",
    baz: "456"
  }), $pass("{/foo,bar}{?baz}", "/abc/def?baz=123", {
    foo: "abc",
    bar: "def",
    baz: "123"
  }), $pass("{/foo,bar}{?g,h}", "/abc/def?g=123&h=456", {
    foo: "abc",
    bar: "def",
    g: "123",
    h: "456"
  }), $pass("{/foo,bar}{?baz*}", "/abc/def?g=123&h=456", {
    foo: "abc",
    bar: "def",
    baz: {
      g: "123",
      h: "456"
    }
  })];
};

exports.testDestructure = testDestructure;