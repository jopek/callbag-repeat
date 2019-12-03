const repeat = (repititions = -1) => source => (start, sink) => {
  if (start !== 0) return;
  let count = repititions;
  let didInit = false;

  let sourceTalkback;
  function sinkTalkback(type, data) {
    sourceTalkback(type, data);
  }

  const subscribe = () => {
    source(0, (t, d) => {
      if (t === 0) {
        sourceTalkback = d;
        if (didInit) {
          sourceTalkback(1);
          return;
        }
        didInit = true;
        sink(0, sinkTalkback);
        return;
      }

      if (t === 2 && !d && count !== 0) {
        count--;
        subscribe();
        return;
      }

      sink(t, d);
    });
  };
  subscribe();
};

module.exports = repeat;
