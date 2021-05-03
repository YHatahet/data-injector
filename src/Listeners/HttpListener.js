"use strict";

const BaseListener = require("./BaseListener");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const textParser = bodyParser.text();

/**
 * http Listener Class
 */
module.exports = class HttpListener extends BaseListener {
  constructor() {
    super();
    this.protocol = "http";
  }

  _startListener(OPTIONS) {
    app
      .post("/", textParser, (req, res) => {
        try {
          const body = req.body;
          console.info(`httpListener: ${body}`);
          this._onDataFunction(body);
          res.status(200).send(body);
        } catch (error) {
          console.error(`httpListener: ${error}`);
          res.status(400);
        }
      })
      .listen(OPTIONS.port || 3000, "0.0.0.0", (err, address) => {
        if (err) throw err;
        console.info(`httpListener: listening on ${address}`);
      });
  }
};
