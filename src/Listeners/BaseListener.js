"use strict";

/**
 * Base Listener class
 * Abstract listener class to be overridden
 */
module.exports = class BaseListener {
  /**
   * Base Listener Constructor
   * @param onDataFunction Function called as a callback when data arrives to the listener
  //  */
  constructor({ onDataFunction }) {
    this.__onDataFunction = (data) => {
      return console.log(`No callback function specified. Input data: ${data}`);
    };
    if (onDataFunction) {
      this.onData(onDataFunction);
    }
  }

  /**
   * Must override in child instance.
   * Starts the listener
   */
  startListener(options) {
    console.error("Must Override this function in Child Listener");
  }

  /**
   * Setter function. Sets the callback function when data is received by the listener.
   * @param {Function} f Callback function
   */
  set onData(f) {
    if (f instanceof Function) {
      this.__onDataFunction = f;
    } else {
      console.error("Inserted object is not of type 'Function'");
    }
  }

};
