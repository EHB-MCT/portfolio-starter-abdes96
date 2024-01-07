const app = require("./app");

// Use uppercase for constants
const PORT = process.env.PORT || 3000;

/**
 * Start the Express server.
 *
 * @function
 * @name startServer
 * @param {number} port - The port number on which the server should listen.
 * @param {Function} callback - The callback function to be executed when the server is started.
 * @returns {void}
 * @description This function starts the Express server on the specified port and executes the provided callback when the server is running.
 */
function startServer(port, callback) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    if (callback && typeof callback === "function") {
      callback();
    }
  });
}

startServer(PORT, () => {
  console.log("Server is ready to handle requests.");
});

/**
 * This script is the entry point for starting the Express server.
 * It imports the configured Express app from app.js and starts the server on the specified port.
 *
 * @module index
 * @requires ./app
 * @requires startServer
 */
