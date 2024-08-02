"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

const { Heap } = require("heap-js");

module.exports = async (logSources, printer) => {
  const cmp = (a, b) => a.log.date - b.log.date;
  const queue = new Heap(cmp);

  const tryQueueNext = async (i) => {
    const nextLog = await logSources[i].popAsync();
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
