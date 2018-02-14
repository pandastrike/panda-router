import assert from "assert"
import {print, test} from "amen"

{parse, destructure, Router} = require "../src/index"

testTemplate = (template, target) ->
  test template, ->
    assert.deepEqual target, parse template

testDestructure = (template, url, target) ->
  test "#{template} : #{url}", ->
    f = destructure parse template
    assert.deepEqual (f url), target

# ((destructure parse "{/foo,bar}{?baz*}") "/abc/def?g=123&h=456")

do ->

  print await test "Panda Router", [

    test "Template Parser", [

      testTemplate "/foo/bar?baz=42", [ "/foo/bar?baz=42" ]

      testTemplate "/{foo}/bar?baz=42",
        [ "/", { variables: [ name: "foo" ] }, "/bar?baz=42" ]

      testTemplate "/foo{/bar}?baz=42",
        [
          "/foo"
          { operator: "/", variables: [ name: "bar" ] }
          "?baz=42"
        ]

      testTemplate "/foo{/bar*}?baz=42",
        [
          "/foo"
          {
            operator: "/"
            variables: [ { name: "bar", modifier: "*" } ]
          }
          "?baz=42"
        ]

      testTemplate "{/foo,bar}?baz=42",
        [
          {
            operator: "/"
            variables: [
              { name: "foo" }
              { name: "bar" }
            ]
          }
          "?baz=42"
        ]

      testTemplate "{/foo,bar*}?baz=42",
        [
          {
            operator: "/"
            variables: [
              { name: "foo" }
              { name: "bar", modifier: "*" }
            ]
          }
          "?baz=42"
        ]

      testTemplate "/foo/bar?baz={baz}",
        [ "/foo/bar?baz=", { variables: [ { name: "baz" } ] } ]

      testTemplate "/foo/bar{?baz}",
        [ "/foo/bar", { operator: "?", variables: [ { name: "baz" } ] } ]

      testTemplate "/foo/bar{?baz*}",
        [
          "/foo/bar",
          {
            operator: "?"
            variables: [ { name: "baz", modifier: "*" } ]
            }
          ]
    ]

    test "Destructuring", [

      testDestructure "/{foo}", "/abc", foo: "abc"

      testDestructure "{/foo}", "/abc", foo: "abc"

      testDestructure "/foo{?baz}", "/foo?baz=123", baz: "123"

      testDestructure "{/foo,bar}", "/abc/def", foo: "abc", bar: "def"

      testDestructure "{/foo*}", "/abc/def", foo: [ "abc", "def" ]

      testDestructure "/foo{?bar,baz}",
        "/foo?bar=123&baz=456",
        bar: "123", baz: "456"

      testDestructure "{/foo,bar}{?baz}", "/abc/def?baz=123",
        foo: "abc"
        bar: "def"
        baz: "123"

      testDestructure "{/foo,bar}{?g,h}", "/abc/def?g=123&h=456",
        foo: "abc"
        bar: "def"
        g: "123"
        h: "456"

      testDestructure "{/foo,bar}{?baz*}", "/abc/def?g=123&h=456",
        foo: "abc"
        bar: "def"
        baz:
          g: "123"
          h: "456"

    ]

    test "Router", [

      test "basic test", ->
        
        router = Router.create()

        router.add
          template: "/foo{/bar}"
          data: "A"

        router.add
          template: "{/foo,bar}"
          data: "B"

        match = router.match "/abc/def"
        assert.equal true, match?
        assert.deepEqual match,
          data: "B"
          bindings:
            foo: "abc"
            bar: "def"


    ]
  ]
