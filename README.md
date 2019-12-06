# callbag-repeat

Callbag operator that repeats/restarts the source stream by repeating the source handshake when source stream finished without error.

The `repeat` operator can be called with `repeat(n)` and without `repeat()` parameters.

Code is based on https://github.com/Andarist/callbag-retry.
The difference is that the input stream error ends the stream, while input stream end triggers a repeat.

`npm install callbag-repeat`

## parametrized

`n = 0` means no repitition: input stream = output stream.
`n = 1` is one repitition after source ended, `n = 2` are two repititions, and so on...

```
const repeat = require("callbag-repeat");
const { fromIter, pipe, forEach } = require("callbag-basics");

pipe(
  fromIter("Abc"),
  repeat(2),
  forEach(v => console.log(v)) // A
                               // b
                               // c
                               // A
                               // b
                               // c
                               // A
                               // b
                               // c
)
```

## unparametrized

Omiting the parameter means infinite repeats.
The stream is stopped by either the downstream consumer with a `type=2` call or by the upstream producer with an error, `type=2` and `data!=undefined`.

```
const repeat = require("callbag-repeat");
const { fromIter, pipe, take, forEach } = require("callbag-basics");

pipe(
  fromIter("abc"),
  repeat(),
  take(100)
  forEach(v => console.log(v)) // A
                               // b
                               // c
                               // 96 emissions later...
                               // A
)
```

Endless loop of a #ball element moving up and down with sine easing in 500ms intervals:

```
const repeat = require("callbag-repeat");
const { fromIter, pipe, take, forEach } = require("callbag-basics");
const durationProgress = require("callbag-duration-progress");
const ball = window.document.getElementById("ball");

pipe(
  durationProgress(500),
  map(t => (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2),
  map(y => y * 300),
  repeat(),
  forEach(y => ball.style.transform = `translate3d(-35px, ${y}px, 0)` )
)
```
