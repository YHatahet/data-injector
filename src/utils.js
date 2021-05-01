"use strict";

module.exports = {
  /**
   * Simple check for seeing if the input string or number object are in valid
   * @param {*} num
   */
  isNumeric(num) {
    return !isNaN(num);
  },

  /**
   * Checks if a string can be parsed into a JSON object
   * @param {String} str string to be checked
   */
  isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  },

  /**
   * Returns the number rounded to the nearest given decimal place
   * @param {Number} nonIntegerValue
   * @param {Number} decimalPlace
   */
  roundToNearestDecimal: function (nonIntegerValue, decimalPlaces) {
    return (
      Math.round(nonIntegerValue * 10 ** decimalPlaces) / 10 ** decimalPlaces
    );
  },
};
