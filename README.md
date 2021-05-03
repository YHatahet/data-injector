# Data Injector
Easily send data between different protocols and databases.

The plan is to have a message queue for each group of listeners and publishers. The queues are filled as messages come in, and are periodically (right now defined as one minute) emptied to send the messages. 


## Setup

1. **Clone the repo.** Simply run `git clone https://github.com/YHatahet/data-injector.git`
2. **Create listeners and publishers.** <_optional_> -  If the listeners and publishers you require do not exist in their respective folders, recreate them. Listeners require `startListener` and `onData` functions to be implemented, while Publishers require `startPublisher` and `publish` functions. Listeners extend the `BaseListener` class, and Publishers the `BasePublisher` class.
3. **Create the config file.** A sample file named `sample-config.js` exists to assist in creating the config file. The parameters for each listener and publisher are passed in as arguments to the `startListener` and `startPublisher` functions.


## Start

First, simply navigate to the data-injector directory and install the dependencies by typing:
```
npm i
``` 
After the dependencies are finished installing, you can run the code by writing: 
```
npm start
``` 
or alternatively, navigate to the directory where index.js is located and run:
```
node .
```
If there are no issues with the listeners and publishers, and the config file is written correctly, there should be no errors on the console.



## Third Party Modules
* ### <u>[Queue Fifo](https://www.npmjs.com/package/queue-fifo)</u>
   *  For the in-memory queue, this npm package will be used. At the time of making this, Node.js does not have an in-memory queue data structure.

* ### <u>[Node-Schedule](https://www.npmjs.com/package/node-schedule)</u>
  * This scheduler is used instead of the built-in `setInterval` to accurately start jobs. This will be used to run the job that will consume the queues and send out the messages.

* ### <u>[MQTT](https://www.npmjs.com/package/mqtt)</u>
  * Client library for the mqtt protocol. Will be used for the mqtt listeners and publishers.

* ### <u>[Express](https://www.npmjs.com/package/express)</u>
  *  Popular web framework for Nodejs. Will be used for HTTP based listeners and publishers.

