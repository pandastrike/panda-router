import assert from "assert"
import {print, test} from "amen"

{parse} = require "../src/index"

testTemplate = (template, target) ->
  test template, ->
    assert.deepEqual target, parse template

do ->

  print await test "Parser", [

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
