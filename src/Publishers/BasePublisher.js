"use strict";


/**
 * Base Publisher class
 * Abstract publisher class to be overridden
 */
module.exports = class BasePublisher {
  /**
   * Base constructor
   */
  constructor() {}

  /**
   * Must override in child instance.
   * Starts the publisher
   */
  __startPublisher(options) {
    console.error("Must Override this function in Child Publisher");
  }

  /**
   * Must override in child instance.
   * Publishes data based on the configuration file
   */
  publish(data) {
    console.error("Must Override this function in Child Publisher");
  }

};
