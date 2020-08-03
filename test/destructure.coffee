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
        h: "4 5 6"

    $pass "{/foo,bar}{?baz*}", "/abc/def?g=123.&h=4%205%206",
      foo: "abc"
      bar: "def"
      baz:
        g: "123."
        h: "4 5 6"

    $pass "{/foo,bar}{?baz*}", "/abc/def?g=123.&h=4/5/6",
      foo: "abc"
      bar: "def"
      baz:
        g: "123."
        h: "4/5/6"

    $pass "/home/{nickname}/edit{?displayName,blurb,media}",
      "/home/dan/edit?displayName=Dan&blurb=I%E2%80%99ve%20seen%20things%20\
        you%20people%20wouldn%E2%80%99t%20believe.%20Attack%20ships%20on%20\
        fire%20off%20the%20shoulder%20of%20Orion.%20I%20watched%20C-beams%20\
        glitter%20in%20the%20dark%20near%20the%20Tannh%C3%A4user%20Gate.%20\
        All%20those%20moments%20will%20be%20lost%20in%20time%2C%20like%20\
        tears%E2%80%A6in%E2%80%A6rain.%20Time%20to%20die.",
      nickname: "dan"
      displayName: "Dan"
      blurb: "I’ve seen things you people wouldn’t believe.
              Attack ships on fire off the shoulder of Orion.
              I watched C-beams glitter in the dark near the
              Tannhäuser Gate. All those moments will be lost
              in time, like tears…in…rain. Time to die."


    $pass "/home/{nickname}/edit", "/home/danielyoder%40gmail.com/edit",
      nickname: "danielyoder@gmail.com"
  ]

export {testDestructure}
