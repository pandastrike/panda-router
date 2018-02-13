"use strict";

var _powerAssertRecorder = function () { function PowerAssertRecorder() { this.captured = []; } PowerAssertRecorder.prototype._capt = function _capt(value, espath) { this.captured.push({ value: value, espath: espath }); return value; }; PowerAssertRecorder.prototype._expr = function _expr(value, source) { var capturedValues = this.captured; this.captured = []; return { powerAssertContext: { value: value, events: capturedValues }, source: source }; }; return PowerAssertRecorder; }();

var _powerAssert = require("power-assert");

var _powerAssert2 = _interopRequireDefault(_powerAssert);

var _amen = require("amen");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var destructure, parse, testDestructure, testTemplate;

({ parse, destructure } = require("../src/index"));

testTemplate = function (template, target) {
  return (0, _amen.test)(template, function () {
    var _rec = new _powerAssertRecorder(),
        _rec2 = new _powerAssertRecorder();

    return _powerAssert2.default.deepEqual(_rec._expr(_rec._capt(target, "arguments/0"), {
      content: "assert.deepEqual(target, parse(template))",
      filepath: "index.coffee",
      line: 8
    }), _rec2._expr(_rec2._capt(parse(_rec2._capt(template, "arguments/1/arguments/0")), "arguments/1"), {
      content: "assert.deepEqual(target, parse(template))",
      filepath: "index.coffee",
      line: 8
    }));
  });
};

testDestructure = function (template, url, target) {
  return (0, _amen.test)(`${template} : ${url}`, function () {
    var _rec3 = new _powerAssertRecorder(),
        _rec4 = new _powerAssertRecorder();

    var f;
    f = destructure(parse(template));
    return _powerAssert2.default.deepEqual(_rec3._expr(_rec3._capt(f(_rec3._capt(url, "arguments/0/arguments/0")), "arguments/0"), {
      content: "assert.deepEqual(f(url), target)",
      filepath: "index.coffee",
      line: 13
    }), _rec4._expr(_rec4._capt(target, "arguments/1"), {
      content: "assert.deepEqual(f(url), target)",
      filepath: "index.coffee",
      line: 13
    }));
  });
};

_asyncToGenerator(function* () {
  return (0, _amen.print)((yield (0, _amen.test)("Panda Router", [(0, _amen.test)("Template Parser", [testTemplate("/foo/bar?baz=42", ["/foo/bar?baz=42"]), testTemplate("/{foo}/bar?baz=42", ["/", {
    variables: [{
      name: "foo"
    }]
  }, "/bar?baz=42"]), testTemplate("/foo{/bar}?baz=42", ["/foo", {
    operator: "/",
    variables: [{
      name: "bar"
    }]
  }, "?baz=42"]), testTemplate("/foo{/bar*}?baz=42", ["/foo", {
    operator: "/",
    variables: [{
      name: "bar",
      modifier: "*"
    }]
  }, "?baz=42"]), testTemplate("{/foo,bar}?baz=42", [{
    operator: "/",
    variables: [{
      name: "foo"
    }, {
      name: "bar"
    }]
  }, "?baz=42"]), testTemplate("{/foo,bar*}?baz=42", [{
    operator: "/",
    variables: [{
      name: "foo"
    }, {
      name: "bar",
      modifier: "*"
    }]
  }, "?baz=42"]), testTemplate("/foo/bar?baz={baz}", ["/foo/bar?baz=", {
    variables: [{
      name: "baz"
    }]
  }]), testTemplate("/foo/bar{?baz}", ["/foo/bar", {
    operator: "?",
    variables: [{
      name: "baz"
    }]
  }]), testTemplate("/foo/bar{?baz*}", ["/foo/bar", {
    operator: "?",
    variables: [{
      name: "baz",
      modifier: "*"
    }]
  }])]), (0, _amen.test)("Destructuring", [testDestructure("/{foo}", "/abc", {
    foo: "abc"
  }), testDestructure("{/foo}", "/abc", {
    foo: "abc"
  }), testDestructure("/foo{?baz}", "/foo?baz=123", {
    baz: "123"
  }), testDestructure("{/foo,bar}", "/abc/def", {
    foo: "abc",
    bar: "def"
  }), testDestructure("{/foo*}", "/abc/def", {
    foo: ["abc", "def"]
  }), testDestructure("/foo{?bar,baz}", "/foo?bar=123&baz=456", {
    bar: "123",
    baz: "456"
  }), testDestructure("{/foo,bar}{?baz}", "/abc/def?baz=123", {
    foo: "abc",
    bar: "def",
    baz: "123"
  }), testDestructure("{/foo,bar}{?g,h}", "/abc/def?g=123&h=456", {
    foo: "abc",
    bar: "def",
    g: "123",
    h: "456"
  }), testDestructure("{/foo,bar}{?baz*}", "/abc/def?g=123&h=456", {
    foo: "abc",
    bar: "def",
    baz: {
      g: "123",
      h: "456"
    }
  })])])));
})();