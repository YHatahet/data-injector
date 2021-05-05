"use strict";

module.exports = {
  listeners: {
    mqtt: {
      host: "<mqtt host>",
      protocol: "<mqtt / mqtts >",
      topic: "<topic to subscribe to>",
      qos: 0,
      username: "<username>",
      password: "<password>",
      clean: true,
    },
    http: {
      port: "<port number>",
    },
    tcp: {
      port: "<port number>",
    },
  },
  publishers: {
    mqtt: {
      host: "<mqtt host>",
      protocol: "<mqtt / mqtts >",
      port: "<port number (nonTLS:1883, TLS:8883)>",
      username: "<username>",
      password: "<password>",
      topic: "<topic to publish to>",
      clean: true,
    },
  },
  pairs: {
    listener_protocol: "publisher_protocol",
    // ex:
    // http: "mqtt",
  },
};
