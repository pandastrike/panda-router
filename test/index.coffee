import assert from "assert"
import {print, test} from "amen"

{parse, destructure, Router} = require "../src/index"

do ->

  print await test "Panda Router", [

    test "Template Parser", do ->

      $pass = (template, expected) ->
        test template, ->
          assert.deepEqual expected, parse template

      [

        $pass "/foo/bar?baz=42", [ "/foo/bar?baz=42" ]

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
      ]

    test "Destructuring", do ->

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

        $pass "/foo{?bar,baz}",
          "/foo?bar=123&baz=456",
          bar: "123", baz: "456"

        $pass "{/foo,bar}{?baz}", "/abc/def?baz=123",
          foo: "abc"
          bar: "def"
          baz: "123"

        $pass "{/foo,bar}{?g,h}", "/abc/def?g=123&h=456",
          foo: "abc"
          bar: "def"
          g: "123"
          h: "456"

        $pass "{/foo,bar}{?baz*}", "/abc/def?g=123&h=456",
          foo: "abc"
          bar: "def"
          baz:
            g: "123"
            h: "456"

      ]

    test "Router", do ->

      router = Router.create()

      router.add
        template: "/foo/bar"
        data: undefined

      router.add
        template: "/foo{/bar}"
        data: "A"

      router.add
        template: "{/foo,bar}"
        data: "B"

      router.add
        template: "/abc/def{?baz}"
        data: "C"

      router.add
        template: "{/foo,bar}{?baz*}"
        data: "D"

      $pass = (url, expected) ->

        test url, ->
          match = router.match url
          assert.equal true, match?
          assert.deepEqual match, expected

      $fail = (url) ->
        test "no match: #{url}", ->
          match = router.match url
          assert.equal false, match?


      [

        $pass "/abc/def",
          data: "B"
          bindings:
            foo: "abc"
            bar: "def"

        $pass "/abc/def?baz=123",
          data: "C"
          bindings:
            baz: "123"

        $pass "/abc/def?g=123&h=456",
          data: "D"
          bindings:
            foo: "abc"
            bar: "def"
            baz:
              g: "123"
              h: "456"

        $fail "/abc?def=123"
    ]
    
  ]
