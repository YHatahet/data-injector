"use strict";

/**
 * This file is meant to handle the initialization of listeners and publishers.
 * It should handle pairing them with the queue.
 */
const config = require("./config");
const ListenerMap = require("./Listeners/index");
const PublisherMap = require("./Publishers/index");
const Queue = require("queue-fifo");

module.exports = class Library {
  constructor(OPTIONS) {
    this.listeners = {}; //{listenerKey : listener instance}
    this.publishers = {}; //{publisherKey : publisher instance}
    this.publisherQueues = {}; // {publisherKey : queue instance}
    this.listenerQueues = {}; // {listenerKey : queue instance}
    this.options = OPTIONS;
  }

  /**
   * Initialize listeners
   * @param {*} options
   */
  _initListeners(options) {
    if (config && config.listeners) {
      for (const key in config.listeners) {
        try {
          if (ListenerMap[key]) {
            this.listeners[key] = new ListenerMap[key](options);
            if (this.listeners[key]) {
              this.listeners[key]._startListener(config.listeners[key]);
            }
          }
        } catch (err) {
          console.error(`Initializing Listeners: ${err}`);
        }
      }
    }
  }

  /**
   * Initialize publishers
   * @param {*} options
   */
  _initPublishers(options) {
    if (config && config.publishers) {
      for (const key in config.publishers) {
        try {
          if (PublisherMap[key]) {
            this.publishers[key] = new PublisherMap[key](options);
            if (this.publishers[key]) {
              this.publishers[key]._startPublisher(config.publishers[key]);
              this.publisherQueues[key] = new Queue(); //attach a queue to each publisher
            }
          }
        } catch (err) {
          console.error(`Initializing Publishers: ${err}`);
        }
      }
    }
  }

  /**
   * Pairs a listener and a publisher based on the input keys, and returns a
   * @param {String} listenerKey key name of an active listener
   * @param {String} publisherKey key name of an active publisher
   * @returns {Boolean} `true` if successful, otherwise `false`
   */
  pair(listenerKey, publisherKey) {
    if (
      this.listeners[listenerKey] && // listener is active
      this.publishers[publisherKey] && // publisher is active
      this.publisherQueues[publisherKey] // publisher has a queue
    ) {
      this.listenerQueues[listenerKey] = this.publisherQueues[publisherKey];
      this.listeners[listenerKey].onData = this.listenerQueues[
        listenerKey
      ].enqueue.bind(this.listenerQueues[listenerKey]);
      return true;
    }
    return false;
  }

  _initPairs() {
    for (const key in config.pairs) {
      if (this.pair(key, config.pairs[key])) {
        console.log(
          `Library: Successfully paired input "${key}" to output "${config.pairs[key]}"`
        );
      } else {
        console.log(
          `Library: Could not pair input "${key}" to output "${config.pairs[key]}"`
        );
      }
    }
  }
  /**
   * Initializes both listeners and publishers
   */
  init() {
    this._initListeners(this.options);
    this._initPublishers(this.options);
    this._initPairs();
  }
};
