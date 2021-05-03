"use strict";

const scheduler = require("node-schedule");

class Runner {
  constructor(OPTIONS) {
    this.outputQueues = []; // [{queue: X, publisher: Y}]
    this.OPTIONS = OPTIONS;
  }

  /**
   * Consumes data in queue and processes them
   */
  _consumeQueues() {
    for (const { queue, publisher } of this.outputQueues) {
      // extra careful
      let size = queue.size();
      while (size > 0 && !queue.isEmpty()) {
        try {
          const data = queue.dequeue();
          size--;
          publisher.publish(data);
        } catch (error) {
          console.error(error);
        }
      }
    }
  }

  /**
   * Initialize scheduler job
   */
  _initMinutelyChecker() {
    const checkMinutelyRule = new scheduler.RecurrenceRule();
    checkMinutelyRule.second = 0; // This rule/job will fire every minute at the 0th second

    /* Logic for the job that should run periodically */
    scheduler.scheduleJob(checkMinutelyRule, () => {
      try {
        // Get commands from queues, clear them, and process the commands
        this._consumeQueues();
      } catch (error) {
        console.error(`Scheduled Job: ${error}`);
      }
    });
  }

  /**
   * Initialize all necessary modules
   */
  init() {
    // start minutely checker
    this._initMinutelyChecker();
  }
}

module.exports = Runner;
