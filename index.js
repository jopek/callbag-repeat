const repeat = source => (start, sink) => {
  const subscribe = () => {
    source(0, (t, d) => {
      if (t===2) {
        subscribe();
        return;
      }
      sink(t, d);
    });
  }
  subscribe()
}

module.export = repeat
