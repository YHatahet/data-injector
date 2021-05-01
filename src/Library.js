"use strict";

/**
 * This file is meant to handle the initialization of listeners and publishers.
 * It should handle pairing them with the queue.
 */
const config = require("./config");
const ListenerMap = require("./Listeners/index");
const PublisherMap = require("./Publishers/index");

module.exports = class Library {
  constructor(OPTIONS) {
    this.listeners = {}; //listener instances
    this.publishers = {}; //publisher instances
    this.options = OPTIONS;
  }

  __initListeners(options) {
    if (config && config.listeners) {
      for (const key of Object.keys(config.listeners)) {
        try {
          if (ListenerMap[key]) {
            this.listeners[key] = new ListenerMap[key](options);
            if (this.listeners[key]) {
              this.listeners[key].__startListener(config.listeners[key]);
            }
          }
        } catch (err) {
          console.error(`Initializing Listeners: ${err}`);
        }
      }
    }
  }

  __initPublishers(options) {
    if (config && config.publishers) {
      for (const key of Object.keys(config.publishers)) {
        try {
          if (PublisherMap[key]) {
            this.publishers[key] = new PublisherMap[key](options);
            if (this.publishers[key]) {
              this.publishers[key].__startPublisher(config.publishers[key]);
            }
          }
        } catch (err) {
          console.error(`Initializing Publishers: ${err}`);
        }
      }
    }
  }

  init() {
    this.__initListeners(this.options);
    this.__initPublishers(this.options);
  }
};
