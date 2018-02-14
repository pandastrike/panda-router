# Panda Router

Match and destructure URLs based on RFC 6570 for URL templates:

```coffee
import {Router} from "panda-router"

router = Router.create()

router.add
  template: "/blog/posts/{key}"
  data: pages.view

router.add
  template: "/blog/posts/{key}{?token}"
  data: pages.edit

match = router.match "/blog/posts/my-first-post?token=miukhuJIguMjq5rXZzslww"

assert.equal true, match?
assert.equal match.data, pages.edit
assert.deepEqual match.bindings,
  key: "my-first-post"
  token: "miukhuJIguMjq5rXZzslww"
```

## Install

`npm i -S panda-router`

## Limitations

- Does not parse all of RFC 6570. For example, the length specifier `:` is not implemented.

- URL templates were not designed for destructuring, but rather expansion. Consequently, it's possible to define templates whose destructuring is not well-defined.
