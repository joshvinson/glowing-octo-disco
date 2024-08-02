const runSync = require("../solution/sync-sorted-merge");
const runAsync = require("../solution/async-sorted-merge");

describe("sync-sorted-merge", () => {
  test("It should print out all logs in date order", () => {
    const results = [];

    const logSources = [
      [{ date: 1 }, { date: 4 }, { date: 7 }, { date: 10 }],
      [{ date: 2 }, { date: 5 }, { date: 8 }, { date: 11 }],
      [{ date: 3 }, { date: 6 }, { date: 9 }, { date: 12 }],
    ].map((arr) => arr.reverse());

    runSync(logSources, {
      print: (log) => results.push(log),
      done: () => {}
    });

    let lastDate = null;
    for (let i = 0; i < results.length; i++) {
      if (lastDate !== null) {
        expect(results[i].date).toBeGreaterThanOrEqual(lastDate);
      }
      lastDate = results[i].date;
    }
  });
});


describe("async-sorted-merge", () => {
  test("It should print out all logs in date order", async () => {
    const results = [];

    const logSourcesData = [
      [{ date: 1 }, { date: 4 }, { date: 7 }, { date: 10 }],
      [{ date: 2 }, { date: 5 }, { date: 8 }, { date: 11 }],
      [{ date: 3 }, { date: 6 }, { date: 9 }, { date: 12 }],
    ].map((arr) => arr.reverse());

    const logSources = logSourcesData.map((data) => {
      return {
        popAsync: () => Promise.resolve(data.pop())
      };
    });

    await runAsync(logSources, {
      print: (log) => results.push(log),
      done: () => {}
    });

    let lastDate = null;
    for (let i = 0; i < results.length; i++) {
      if (lastDate !== null) {
        expect(results[i].date).toBeGreaterThanOrEqual(lastDate);
      }
      lastDate = results[i].date;
    }
  });
});