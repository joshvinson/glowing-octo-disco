"use strict";

// Print all entries, across all of the sources, in chronological order.

const { Heap } = require("heap-js");

module.exports = (logSources, printer) => {
  const cmp = (a, b) => a.log.date - b.log.date;
  const queue = new Heap(cmp);

  const tryQueueNext = (i) => {
    const nextLog = logSources[i].pop();
    if (nextLog) {
      queue.push({ index: i, log: nextLog });
    }
  };

  for (let i = 0; i < logSources.length; i++) {
    tryQueueNext(i);
  }

  while (queue.length > 0) {
    const entry = queue.pop();

    printer.print(entry.log);

    tryQueueNext(entry.index);
  }

  printer.done();
};
