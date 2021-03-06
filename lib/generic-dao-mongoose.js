/**
 * The MIT License (MIT)
 * Copyright (c) 2014 SAS 9 Février
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict;';

var jsAugment = require('js.augment'),
    util = require('util'),
    GenericDao = require('node.generic-dao'),
    async = require('async'),
    mongoose = require('mongoose'),
    Exceptions = require('./exceptions');

/**
 * Generic DAO.
 * @class
 * @type {GenericDaoMongoose}
 */
var GenericDaoMongoose = GenericDao.augment({
    /**
     * Create a new instance.
     * @memberof GenericDaoMongoose
     * @constructor
     */
    constructor: function () {
        GenericDao.call(this);
    },
    /**
     * Create one or several record(s).
     * @memberof GenericDaoMongoose
     * @param {object|array} items - The item(s) to create.
     * @param {function} callback - Callback function.
     * @return {GenericDaoMongoose} The current instance.
     */
    create: function (items, callback) {
        GenericDao.prototype.create.apply(this, [items, callback]);
    },
    /**
     * Create one record.
     * @memberof GenericDaoMongoose
     * @param {object} item - The item to create.
     * @param {function} callback - Callback function.
     * @return {GenericDaoMongoose} The current instance.
     */
    createOne: function (item, callback) {
        var self = this;
        async.waterfall([
            function (callback) {
                var retval = self.createModelInstance(item);
                var id = retval._id;
                retval.save(function (err) {
                    if (err) callback(err);
                    callback(err, id);
                });
            },
            function (id, callback) {
                self.getById(id, function (err, result) {
                    callback(err, result);
                });
            }
        ], function (err, results) {
            callback(err, results);
        });
    },
    /**
     * Returns record matching with provided identifier in argument. Null if object doesn't exist.
     * @memberof GenericDaoMongoose
     * @param {string} id - Identifier.
     * @param {function} callback - Callback function.
     */
    getById: function (id, callback) {
        this.getModelClass().findById(id, function (err, result) {
            if (result === null) err = new Exceptions.GenericDaoMongooseError('Object <id=' + id + '> not found');
            callback(err, result);
        });
    },
    /**
     * Returns record filtered with arguments.
     * @memberof GenericDaoMongoose
     * @param {object} params - Filter arguments.
     * @param {function} callback - Callback function.
     */
    filter: function (params, callback) {
        if (!params.where) {
            params.where = {};
        }
        ;
        if (!params.select) {
            params.select = null;
        }
        ;
        if (!params.sort) {
            params.sort = {};
        }
        var self = this;
        async.waterfall([
            function (callback) {
                var query = self.getModelClass().find(params.where, params.select, {sort: params.sort});
                if (params.populate) {
                    query = query.populate(params.populate);
                }
                query.exec(function (err, results) {
                    callback(err, results);
                });
            }
        ], function (err, results) {
            callback(err, results);
        });
    },
    /**
     * Returns first record filtered with arguments.
     * @memberof GenericDaoMongoose
     * @param {object} params - Filter arguments.
     * @param {function} callback - Callback function.
     */
    getOne: function(params, callback) {
        var self = this;
        this.filter(params, function(err, results) {
            var retval;
            if ((results) && (util.isArray(results) && (results.length > 0))) {
                retval = results[0];
            }
            callback(err, retval);
            return self;
        });
    },
    /**
     * Returns all records.
     * @memberof GenericDaoMongoose
     * @param {function} callback - Callback function.
     */
    all: function (callback) {
        var self = this;
        this.filter({}, function (err, results) {
            callback(err, results);
        });
    },
    /**
     * Update a record by identifier.
     * @memberof GenericDaoMongoose
     * @param {object|array} data - The item(s) to update.
     * @param {function} callback - Callback function.
     */
    updateById: function (id, data, callback) {
        var self = this;
        var pkName = this.getPrimaryKeyName();

        if (data.hasOwnProperty(pkName)) {
            delete(data[pkName]);
        }

        var query = self.getModelClass().findByIdAndUpdate(id, { $set: data}, function (err, result) {
            if (err) callback(err);
            callback(err, result);
        });
    },
    /**
     * Remove one or several record(s).
     * @memberof GenericDaoMongoose
     * @param {object|array} items - The item(s) to remove.
     * @param {function} callback - Callback function.
     */
    remove: function (items, callback) {
        GenericDao.prototype.remove.apply(this, [items, callback]);
    },
    /**
     * Remove an object by identifier.
     * @memberof GenericDaoMongoose
     * @param {string} id - The record identifier.
     * @param {function} callback - Callback function.
     * @return {GenericDaoMongoose} The current instance.
     */
    removeById: function (id, callback) {
        this.getModelClass().findByIdAndRemove(id, {},
            function (err) {
                callback(err, (!err));
            });
    },

    /**
     * Create a model instance.
     * @memberof GenericDaoMongoose
     * @param {object} data - The model attributes.
     * @returns {object} The model instance for provided object.
     */
    createModelInstance: function (data) {
        return new (this.getModelClass())(data);
    },
    _getSimplifiedObject: function (id) {
        var simplifiedObject = {};
        simplifiedObject[this.getPrimaryKeyName()] = id;
        return simplifiedObject;
    }
});

/** Exports GenericDaoMongoose module. */
module.exports = GenericDaoMongoose;
