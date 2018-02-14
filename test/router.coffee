import assert from "assert"
import {Router} from "../src/index"

testRouter = (test) ->

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

export {testRouter}
