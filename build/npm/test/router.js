"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testRouter = undefined;

var _powerAssertRecorder = function () { function PowerAssertRecorder() { this.captured = []; } PowerAssertRecorder.prototype._capt = function _capt(value, espath) { this.captured.push({ value: value, espath: espath }); return value; }; PowerAssertRecorder.prototype._expr = function _expr(value, source) { var capturedValues = this.captured; this.captured = []; return { powerAssertContext: { value: value, events: capturedValues }, source: source }; }; return PowerAssertRecorder; }();

var _powerAssert = require("power-assert");

var _powerAssert2 = _interopRequireDefault(_powerAssert);

var _index = require("../src/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var testRouter;

exports.testRouter = testRouter = function (test) {
  var $fail, $pass, router;
  router = _index.Router.create();
  router.add({
    template: "/foo/bar",
    data: void 0
  });
  router.add({
    template: "/foo{/bar}",
    data: "A"
  });
  router.add({
    template: "{/foo,bar}",
    data: "B"
  });
  router.add({
    template: "/abc/def{?baz}",
    data: "C"
  });
  router.add({
    template: "{/foo,bar}{?baz*}",
    data: "D"
  });
  $pass = function (url, expected) {
    return test(url, function () {
      var _rec = new _powerAssertRecorder(),
          _rec2 = new _powerAssertRecorder(),
          _rec3 = new _powerAssertRecorder();

      var match;
      match = router.match(url);
      _powerAssert2.default.equal(true, _rec._expr(_rec._capt(_rec._capt(match, "arguments/1/left") != null, "arguments/1"), {
        content: "assert.equal(true, match != null)",
        filepath: "router.coffee",
        line: 32
      }));
      return _powerAssert2.default.deepEqual(_rec2._expr(_rec2._capt(match, "arguments/0"), {
        content: "assert.deepEqual(match, expected)",
        filepath: "router.coffee",
        line: 33
      }), _rec3._expr(_rec3._capt(expected, "arguments/1"), {
        content: "assert.deepEqual(match, expected)",
        filepath: "router.coffee",
        line: 33
      }));
    });
  };
  $fail = function (url) {
    return test(`no match: ${url}`, function () {
      var _rec4 = new _powerAssertRecorder();

      var match;
      match = router.match(url);
      return _powerAssert2.default.equal(false, _rec4._expr(_rec4._capt(_rec4._capt(match, "arguments/1/left") != null, "arguments/1"), {
        content: "assert.equal(false, match != null)",
        filepath: "router.coffee",
        line: 38
      }));
    });
  };
  return [$pass("/abc/def", {
    data: "B",
    bindings: {
      foo: "abc",
      bar: "def"
    }
  }), $pass("/abc/def?baz=123", {
    data: "C",
    bindings: {
      baz: "123"
    }
  }), $pass("/abc/def?g=123&h=456", {
    data: "D",
    bindings: {
      foo: "abc",
      bar: "def",
      baz: {
        g: "123",
        h: "456"
      }
    }
  }), $fail("/abc?def=123")];
};

exports.testRouter = testRouter;