"use strict";

// Key name needs to match config file key
module.exports = {
  mqtt: require("./MqttListener"),
  http: require("./HttpListener"),
  tcp: require("./TcpListener"),
};
