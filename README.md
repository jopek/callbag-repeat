# callbag-repeat
Callbag operator that repeats/restarts the source stream by repeating the source handshake when source stream finished without error.

The `repeat` operator can be called with `repeat(n)` and without `repeat()` parameters.

Code is almost the same as https://github.com/Andarist/callbag-retry. The difference is that the input stream error ends the stream, while input stream end triggers a repeat.


## parametrized
`n = 0` means no repitition: input stream = output stream. `n = 1` is one repitition (one restarted once or more), `n = 2` are two repititions, and so on... 

```
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
Omiting the parameter means infinite repeats. The stream is stopped by either the downstream consumer with a `type=2` call or by the upstream producer with an error, `type=2` and `data!=undefined`.

```
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
