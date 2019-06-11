import assert from "assert"
import {destructure, parse} from "../src/index"

testDestructure = (test) ->

  $pass = (template, url, expected) ->
    test "#{template} : #{url}", ->
      f = destructure parse template
      assert.deepEqual (f url), expected

  [

    $pass "/{foo}", "/abc", foo: "abc"

    $pass "{/foo}", "/abc", foo: "abc"

    $pass "/foo{?baz}", "/foo?baz=123", baz: "123"

    $pass "{/foo,bar}", "/abc/def", foo: "abc", bar: "def"

    $pass "{/foo*}", "/abc/def", foo: [ "abc", "def" ]

    $pass "/foo{?bar,baz}", "/foo?bar=123&baz=456",
      bar: "123",
      baz: "456"

    # reverse the order of the parameters
    $pass "/foo{?bar,baz}", "/foo?baz=456&bar=123",
      bar: "123",
      baz: "456"

    # only one of two - first argument only
    $pass "/foo{?bar,baz}", "/foo?bar=123",
      bar: "123"

    # only one of two - second argument only
    $pass "/foo{?bar,baz}", "/foo?baz=456",
      baz: "456"

    # + delimited value
    $pass "/foo{?bar,baz}", "/foo?baz=123+456&bar=789",
      bar: "789"
      baz: "123+456"

    $pass "{/foo,bar}{?baz}", "/abc/def?baz=123",
      foo: "abc"
      bar: "def"
      baz: "123"

    $pass "{/foo,bar}{?g,h}", "/abc/def?g=123&h=456",
      foo: "abc"
      bar: "def"
      g: "123"
      h: "456"

    $pass "{/foo,bar}{?baz*}", "/abc/def?g=123&h=4-5-6",
      foo: "abc"
      bar: "def"
      baz:
        g: "123"
        h: "4-5-6"

    $pass "/abc/def{?baz}", "/abc/def", {}

    $pass "{/foo,bar}{?baz*}", "/abc/def?g=123&h=4%205%206",
      foo: "abc"
      bar: "def"
      baz:
        g: "123"
        h: "4%205%206"

    $pass "{/foo,bar}{?baz*}", "/abc/def?g=123.&h=4%205%206",
      foo: "abc"
      bar: "def"
      baz:
        g: "123."
        h: "4%205%206"

  ]

export {testDestructure}
