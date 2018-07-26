"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testDestructure = undefined;

var _powerAssert = require("power-assert");

var _powerAssert2 = _interopRequireDefault(_powerAssert);

var _index = require("../src/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var testDestructure;

exports.testDestructure = testDestructure = function (test) {
  var $pass;
  $pass = function (template, url, expected) {
    return test(`${template} : ${url}`, function () {
      var f;
      f = (0, _index.destructure)((0, _index.parse)(template));
      return f(url);
    });
  };
  return [
  // assert.deepEqual (f url), expected
  $pass("/{foo}", "/abc", {
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
  }), $pass("{/foo,bar}{?baz*}", "/abc/def?g=123&h=4-5-6", {
    foo: "abc",
    bar: "def",
    baz: {
      g: "123",
      h: "4-5-6"
    }
  }), $pass("/abc/def{?baz}", "/abc/def", {
    baz: void 0
  })];
};

exports.testDestructure = testDestructure;