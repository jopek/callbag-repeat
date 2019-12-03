const test = require("tape");
const repeat = require("./");

const { fromIter, pipe, take, scan, forEach } = require("callbag-basics");
const last = require("callbag-last");

test("output of parametrized repetition should be as expected", t => {
  t.plan(22);
  const input = [12, 45];
  const expectedTypes = [
    [0, "function"],
    [1, "number"],
    [1, "number"],
    [1, "number"],
    [1, "number"],
    [1, "number"],
    [1, "number"],
    [2, "undefined"]
  ];
  const expectedOutput = [12, 45, 12, 45, 12, 45];

  function consumer(type, data) {
    const et = expectedTypes.shift();
    t.equals(type, et[0], "expected type is " + et[0]);
    t.equals(typeof data, et[1], "expected data type is " + et[1]);

    if (type === 0) {
      consumer.ask = data;
    } else if (type === 1) {
      t.equals(data, expectedOutput.shift());
    }
    if (type === 0 || type === 1) consumer.ask(1);
  }

  repeat(2)(fromIter(input))(0, consumer);

  t.end();
});

test("unparametrized repetition results in endless repetition", t => {
  pipe(
    fromIter("abc"),
    repeat(1),
    take(100),
    scan((prev, x) => prev.concat(x), []),
    last(),
    forEach(v => {
      t.equals(
        v.length,
        100,
        "grabbing 100 elements from repitition is 100 elements"
      );
      const items = v.reduce((prev, val) => {
        if (prev[val]) prev[val]++;
        else prev[val] = 1;
        return prev;
      }, {});
      t.deepEquals(items, { a: 34, b: 33, c: 33 });
    })
  );
  t.end();
});
