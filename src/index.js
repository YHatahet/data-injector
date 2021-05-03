"use strict";

const Runner = require("./Runner");
const Library = require("./Library");

const run = () => {
  try {
    const library = new Library();
    const runner = new Runner();
    library.init();
    runner.init();

    const publishers = library.publishers;
    const publisherQueues = library.publisherQueues;

    // Connect publisher queues to job runner queues
    for (const key in publisherQueues) {
      runner.outputQueues.push({
        publisher: publishers[key],
        queue: publisherQueues[key],
      });
    }
  } catch (error) {
    console.error(error);
  }
};

run();
