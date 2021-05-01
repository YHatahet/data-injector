# data-injector
Easily send data between different protocols and databases.

The plan is to have a message queue for each group of listeners and publishers. The queues are filled as messages come in, and are periodically (based on user choice) emptied to send the messages. 


### <u>[Queue Fifo](https://www.npmjs.com/package/queue-fifo)</u>
For the in-memory queue, this npm package will be used. At the time of making this, Node.js does not have an in-memory queue data structure.

### <u>[Node-Schedule](https://www.npmjs.com/package/node-schedule)</u>
This scheduler is used instead of the built-in `setInterval` to accurately start jobs. This will be used to run the jobs that will consume the queues and send out the messages.


### <u>[MQTT](https://www.npmjs.com/package/mqtt)</u>
Client library for the mqtt protocol. Will be used for the mqtt listeners and publishers.
