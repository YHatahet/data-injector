"use strict";

const net = require("net");
const BaseListener = require("./BaseListener");

/**
 * Tcp Listener Class
 */
module.exports = class TcpListener extends BaseListener {
  constructor() {
    super();
    this.protocol = "tcp";
  }

  startListener(OPTIONS) {
    // Create a new TCP server.
    const server = new net.createServer();
    const self = this;

    // Server listens to a socket for a client to make a connection request.
    server.listen(OPTIONS.port, () => {
      console.info(
        `tcpListener: listening for connection requests on localhost:${OPTIONS.port}`
      );
    });

    // When client requests a connection, the server creates a new socket dedicated to that client
    server.on("connection", function (socket) {
      console.info(
        `tcpListener: new connection has been established from ${
          socket.address()?.address
        }`
      );

      socket.on("data", (chunk) => {
        const data = chunk.toString();
        console.info(`tcpListener: ${data}`);
        self._onDataFunction(data);
      });

      // end server connection when client requests to terminate the connection
      socket.on("end", function () {
        console.info("tcpListener: closing connection with client");
      });

      socket.on("error", function (err) {
        console.error(`Error: ${err}`);
      });
    });
  }
};
