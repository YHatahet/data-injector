"use strict";

const Runner = require("./Runner");
const Library = require("./Library");

const run = () => {
  try {
    const library = new Library();
    const runner = new Runner();
    library.init();
    runner.init();
    library.pair("mqtt", "mqtt"); //TODO make part of config

    const publishers = library.publishers;
    const listeners = library.listeners;
    const publisherQueues = library.publisherQueues;
    const listenerQueues = library.listenerQueues;

    // Assign the onData functions for each listener.
    // Listeners will populate each Queue they are assigned to
    for (const key in listeners) {
      listeners[key].onData = listenerQueues[key].enqueue.bind(
        listenerQueues[key]
      );
    }

    // Attach listener to Queue
    for (const key in publishers) {
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
