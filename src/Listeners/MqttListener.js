"use strict";

const BaseListener = require("./BaseListener");
const MQTT = require("mqtt");
const get = require("lodash/get");
const { isNumeric } = require("../utils");

/**
 * MQTT Listener Class
 */
module.exports = class MqttListener extends BaseListener {
  constructor(OPTIONS) {
    super(OPTIONS);
    this.timeToReconnect = 10000;
    this.protocol = "mqtt";
    this.mqttClient;
    this.options = OPTIONS;
  }

  /**
   * Starts mqtt Listener
   * @param {*} OPTIONS Object containing options required
   */
  _startListener(OPTIONS) {
    try {
      const dataTopic = OPTIONS.topic;

      if (isNumeric(OPTIONS.timeToReconnect)) {
        const time = Number(OPTIONS.timeToReconnect);
        this.timeToReconnect = time < 10000 ? 10000 : time;
      }

      const options = this._extractMqttClientOptions(OPTIONS);
      const mqttClient = MQTT.connect({
        ...options,
        keepalive: 0,
        reconnectPeriod: 0,
      });
      this.mqttClient = mqttClient;

      mqttClient.on("connect", () => {
        mqttClient.subscribe(dataTopic, (err, granted) => {
          if (err) {
            console.info(`mqttListener: could not subscribe. `, err);
          } else {
            console.info(`mqttListener: listening on topic ${dataTopic}`);
          }
        });
      });

      mqttClient.on("message", (topic, m_buff) => {
        try {
          console.info(`mqttListener on ${topic}: ${m_buff}`);

          // Remove leading and trailing white spaces
          const msgValue = m_buff.toString().trim();

          // Check that the message exists
          if (msgValue === "") throw new Error("Empty message detected");

          // Split then check if the topic exists
          const topicArray = topic.split("/");
          if (!(topicArray && topicArray.length >= 1))
            throw new Error("Incorrect topic length");

          // Use the onDataFunction
          this._onDataFunction(msgValue);
        } catch (error) {
          console.error(`mqttListener: ${error}`);
        }
      });

      mqttClient.on("error", (err) => {
        console.error(`mqttListener Error: ${err}`);
      });

      mqttClient.on("close", () => {
        console.log(
          `mqttListener: Connection closed, will attempt to reconnect in ${(
            this.timeToReconnect / 1000
          ).toFixed(1)} seconds`
        );
        this._mqttReconnectLogic(mqttClient);
      });
    } catch (err) {
      console.error(`mqttListener: ${err}`);
    }
  }

  _mqttReconnectLogic() {
    if (this.mqttClient instanceof MQTT.MqttClient) {
      if (!this.mqttClient.connected) {
        setTimeout(() => {
          console.info("mqttListener: Attempting to reconnect");
          this.mqttClient.reconnect();
        }, this.timeToReconnect);
      } else {
        console.info("mqttListener: Mqtt connection reestablished!");
      }
    } else {
      throw new Error("Input is not a child instance of the MQTT class");
    }
  }

  /**
   * Check and extract necessary mqtt client options, then return the newly valid formed object.
   * @param {*} OPTIONS Object containing the mqtt options for the publisher
   */
  _extractMqttClientOptions(OPTIONS) {
    // default options
    const options = {
      host: "broker.mqtt-dashboard.com",
      protocol: "mqtt",
    };

    if (OPTIONS) {
      // populate options based on config
      ["host", "protocol", "cert", "key", "ca", "username", "password"].forEach(
        (key) => {
          const value = get(OPTIONS, `${key}`);
          if (value) options[key] = value;
        }
      );
      // get the file from the path
      ["cert", "key", "ca"].forEach((key) => {
        const file = options[key];
        if (file) options[key] = fs.readFileSync(file);
      });
    }
    if (!options.port) {
      if (options.protocol === "mqtts" || options.protocol === "wss")
        options.port = 8883;
      else options.port = 1883;
    }
    return options;
  }
};
