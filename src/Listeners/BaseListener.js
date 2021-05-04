"use strict";

/**
 * Base Listener class
 * Abstract listener class to be overridden
 */
module.exports = class BaseListener {
  /**
   * Base Listener Constructor
   * @param onDataFunction Function called as a callback when data arrives to the listener
   */
  constructor(onDataFunction = undefined) {
    this._onDataFunction = (data) => {
      return console.log(`No callback function specified. Input data: ${data}`);
    };
    if (onDataFunction) {
      this.onData = onDataFunction;
    }
  }

  /**
   * Must override in child instance.
   * Starts Listener
   * @param {*} opts Object containing options required
   */
  startListener(opts) {
    console.error("Must Override this function in Child Listener");
  }

  /**
   * Setter function. Sets the callback function when data is received by the listener.
   * @param {Function} f Callback function
   */
  set onData(f) {
    if (f instanceof Function) {
      this._onDataFunction = f;
    } else {
      throw new Error("Inserted object is not of type 'Function'");
    }
  }
};
