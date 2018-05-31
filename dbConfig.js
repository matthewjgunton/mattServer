"use strict"

// Bring Mongoose into the app
var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();

// Build the connection string
mongoose.dbURI = '';

// Create the database connection
// mongoose.connect(mongoose.dbURI);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
	console.log('Mongoose default connection open to ' + mongoose.dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
	console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
	console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
	mongoose.connection.close(function () {
	console.log('\nServer shut down\nclosing connection to database');
	process.exit(0);
	});
});

module.exports = mongoose;

// BRING IN YOUR SCHEMAS & MODELS // For example
// require('./../model/team');
