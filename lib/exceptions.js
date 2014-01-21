'use strict;';
var util = require('util');

/**
 * Not implemented error.
 * @param message
 * @constructor
 *
 */
var GenericDaoMongooseError = function(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message;
};

// inherit from Error
util.inherits(GenericDaoMongooseError, Error);

module.exports.GenericDaoMongooseError = GenericDaoMongooseError;