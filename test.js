const test = require('tape');
const repeat = require('./');
const fromIter = require('callbag-from-iter');

test('it creates a source with a single lazyly evaluated value then completes', t => {
  t.plan(8);
  let value;
  const downwardsExpectedType = [
    [0, 'function'],
    [1, 'string'],
    [2, 'undefined'],
  ];
  const downwardsExpected = [12, 45, 12, 45, 12];
  const input = [12, 45];

  function sink(type, data) {
    const et = downwardsExpectedType.shift();
    t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
    t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);
    if (type === 0) {
      sink.ask = data;
      sink.count = 0;
    } else if (type === 1) {
      const e = downwardsExpected.shift();
      t.equals(data, e, 'downwards data is expected: ' + e);
    }
    if (type === 0 || type === 1) sink.ask(1);
  }

  const src = fromIter(input)(repeat)

  setTimeout(() => src(0, sink), 5);

  value = 'one value';

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 10);
});

