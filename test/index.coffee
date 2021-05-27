import { test} from "@dashkite/amen"
import print from "@dashkite/amen-console"

import {testParser} from "./parse"
import {testDestructure} from "./destructure"
import {testRouter} from "./router"

do ->

  print await test "Panda Router", [

    test "Template Parser", testParser test
    test "Destructuring", testDestructure test
    test "Router", testRouter test

  ]
