'use strict;';

var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var log4js = require('log4js');

var conn = null;

var logger = log4js.getLogger('populate');
logger.setLevel('INFO');

/**
 * Class to populate database with mongodb native driver.
 * @name DbPopulator
 * @param {string} filename - The file which contains data to insert.
 * @constructor
 */
var DbPopulator = function (filename, dbUri) {
    this.data = require(filename);
    this.dbUri = dbUri;
};

DbPopulator.prototype = {
    /**
     * memberof DbPopulator
     */
    constructor: DbPopulator,

    connectDatabase: function (callback) {
        logger.debug('connectDatabase:start');
        var self = this;
        MongoClient.connect(this.dbUri, function (err, db) {
            if (err) throw err;
            logger.debug('connectDatabase:finished');
            self.conn = db;
            callback(err);
        });
    },

    dropDatabase: function (callback) {
        var self = this;
        logger.debug('dropDatabase:start');
        this.conn.dropDatabase(function (err, done) {
            if (err) throw err;
            logger.debug('dropDatabase:finished');
            callback(null);
        });
    },

    closeDatabase: function (callback) {
        var self = this;
        logger.debug('closeDatabase:start');
        self.conn.close(function (err, done) {
            if (err) throw err;
            logger.debug('closeDatabase:finished');
            callback(null);
        })
    },


    getCollectionNames: function (callback) {
        var self = this;
        logger.debug('getCollectionsNames:start');
        var retval = [];
        var len = Object.keys(data).length;
        logger.debug('getCollectionsNames:len:' + len);
        var i = 0;
        Object.keys(data).forEach(function (item) {
            logger.debug(item);
            self.conn.createCollection(item, function (err, collection) {
                if (err) throw err;
                collection.insert(data[item], {
                    safe: true
                }, function (e, d) {
                    i++;
                    if (e) throw e;
                    logger.debug('data for ' + item + 'created');
                    if (len === i) callback();
                })

            });
        });
        //callback();
    },

    populate: function (callback) {
        var self = this;
        logger.debug('populate:start');
        async.waterfall([
            self.connectDatabase,
            self.dropDatabase,
            self.getCollectionNames,
            self.closeDatabase
        ], function (err, results) {
            logger.debug('populate:finished');
            callback();
        });
    }
};

module.exports = DbPopulator;
