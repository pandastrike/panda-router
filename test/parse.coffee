import assert from "assert/strict"
import {parse} from "../src/index"

testParser = (test) ->

  $pass = (template, expected) ->
    test template, ->
      assert.deepEqual expected, parse template

  [

    $pass "/foo/bar?baz=42", [ "/foo/bar?baz=42" ]

    $pass "/foo-bar/baz", [ "/foo-bar/baz" ]

    $pass "/{foo}/bar?baz=42",
      [ "/", { variables: [ name: "foo" ] }, "/bar?baz=42" ]

    $pass "/foo{/bar}?baz=42",
      [
        "/foo"
        { operator: "/", variables: [ name: "bar" ] }
        "?baz=42"
      ]

    $pass "/foo{/bar*}?baz=42",
      [
        "/foo"
        {
          operator: "/"
          variables: [ { name: "bar", modifier: "*" } ]
        }
        "?baz=42"
      ]

    $pass "{/foo,bar}?baz=42",
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

    $pass "{/foo,bar*}?baz=42",
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

    $pass "/foo/bar?baz={baz}",
      [ "/foo/bar?baz=", { variables: [ { name: "baz" } ] } ]

    $pass "/foo/bar{?baz}",
      [ "/foo/bar", { operator: "?", variables: [ { name: "baz" } ] } ]

    $pass "/foo/bar{?baz*}",
      [
        "/foo/bar",
        {
          operator: "?"
          variables: [ { name: "baz", modifier: "*" } ]
          }
        ]

    $pass "example.org/foo/bar?baz=42", [ "example.org/foo/bar?baz=42" ]

    $pass "example.org/foo/bar{?baz*}",
      [
        "example.org/foo/bar",
        {
          operator: "?"
          variables: [ { name: "baz", modifier: "*" } ]
          }
        ]

    $pass "https://example.org/foo/bar{?baz*}",
      [
        "https://example.org/foo/bar",
        {
          operator: "?"
          variables: [ { name: "baz", modifier: "*" } ]
          }
        ]

  ]

export {testParser}
