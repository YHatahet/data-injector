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
   * Starts Publisher
   * @param {*} opts Object containing options required
   */
  startPublisher(opts) {
    console.error("Must Override this function in Child Publisher");
  }

  /**
   * Must override in child instance.
   * Publishes data based on the configuration file
   * @param {*} data Data to be published
   */
  publish(data) {
    console.error("Must Override this function in Child Publisher");
  }
};
