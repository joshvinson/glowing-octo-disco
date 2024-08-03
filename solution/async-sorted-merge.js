"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

const { Heap } = require("heap-js");

const asyncBuffer = (s) => {
  let nextPromise = s.popAsync();
  return {
    popAsync: async (i) => {
      const val = await nextPromise;
      nextPromise = s.popAsync();
      return val;
    }
  };
};

module.exports = async (logSources, printer) => {
  const cmp = (a, b) => a.log.date - b.log.date;
  const queue = new Heap(cmp);

  const buffers = logSources.map(
    s => asyncBuffer(s)
  );

  const tryQueueNext = async (i) => {
    const nextLog = await buffers[i].popAsync();
    if (nextLog) {
      queue.push({ index: i, log: nextLog });
    }
  };

  await Promise.all(logSources.map((_, i) => tryQueueNext(i)));

  while (queue.length > 0) {
    const entry = queue.pop();

    printer.print(entry.log);

    await tryQueueNext(entry.index);
  }

  printer.done();
};
