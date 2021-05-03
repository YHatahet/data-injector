"use strict";

const BasePublisher = require("./BasePublisher");
const MQTT = require("mqtt");
const get = require("lodash/get");
const { isNumeric } = require("../utils");

/**
 * MQTT Publisher Class
 */
module.exports = class MqttPublisher extends BasePublisher {
  constructor() {
    super();
    this.timeToReconnect = 10000;
    this.protocol = "mqtt";
    this.mqttClient;
    this.options;
  }

  /**
   * Starts mqtt Publisher
   * @param {*} opts Object containing options required
   */
  _startPublisher(opts) {
    try {
      this.options = opts;

      if (isNumeric(opts.timeToReconnect)) {
        const time = Number(opts.timeToReconnect);
        this.timeToReconnect = time < 10000 ? 10000 : time;
      }

      const options = this._extractMqttClientOptions(opts);
      const mqttClient = MQTT.connect({
        ...options,
        keepalive: 0,
        reconnectPeriod: 0,
      });

      this.mqttClient = mqttClient;

      mqttClient.on("connect", () => {
        console.info(`mqttPublisher: Connected to ${opts.host}:${opts.port}`);
        console.info(`mqttPublisher: Publishing to ${opts.topic}`);
      });

      mqttClient.on("error", (err) => {
        throw new Error(`mqttPublisher Error: ${err}`);
      });

      mqttClient.on("close", () => {
        console.info(
          `mqttPublisher: Connection closed, will attempt to reconnect in ${(
            this.timeToReconnect / 1000
          ).toFixed(1)} seconds`
        );
        this._mqttReconnectLogic(mqttClient);
      });
    } catch (err) {
      console.error(`mqttPublisher: ${err}`);
    }
  }

  publish(data) {
    if (this.mqttClient?.connected) {
      this.mqttClient?.publish(this.options?.topic, String(data));
      console.info(
        `mqttPublisher: Sending to '${this.options.topic}' --> ${data}`
      );
    } else {
      console.info("reconnecting");
      this.mqttClient?.reconnect();
    }
  }

  /**
   * Logic for attempting to reconnect to the mqtt server in case of a connection failure.
   */
  _mqttReconnectLogic() {
    if (this.mqttClient instanceof MQTT.MqttClient) {
      if (!this.mqttClient.connected) {
        setTimeout(() => {
          console.info("mqttPublisher: Attempting to reconnect");
          this.mqttClient.reconnect();
        }, this.timeToReconnect);
      } else {
        console.info("mqttPublisher: Mqtt connection reestablished!");
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
