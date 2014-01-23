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

var DbPopulator = require('./utils/populator'),
    mongoose = require('mongoose'),
    assert = require('assert'),
    GenericDaoMongoose = require('../lib/generic-dao-mongoose');

/** The URI used for database connection. */
var dbUri = 'mongodb://localhost:27017/dao';
/** The database connection. */
var db = mongoose.createConnection(dbUri);
/** The testing data. */
var data = require('./data/testing-data');

/**
 * Customer schema used for testing.
 * @type {mongoose.Schema}
 */
var CustomerSchema = new mongoose.Schema({
    creationTimestamp: {type: Date, default: Date.now},
    modificationTimestamp: {type: Date, default: Date.now},
    name: String
}, {
    collection: 'customer'
});

CustomerSchema.pre('save', function (next) {
    this.modificationTimestamp = new Date();
    next();
});

var CustomerModel = db.model('Customer', CustomerSchema);

var CustomerDao = GenericDaoMongoose.augment({
    constructor: function () {
        GenericDaoMongoose.call(this);
    }
});
var customerDao = new CustomerDao();
customerDao.setModelClass(CustomerModel);
customerDao.setPrimaryKeyName('_id');

/**
 * Unit tests to validate GenericDaoMongoose.
 */
describe('Customers test', function () {

    /**
     * Before each test, drop the collection then populate.
     */
    beforeEach(function (done) {
        this.timeout(3000);
        var populator = new DbPopulator(dbUri, data);
        populator.populate(done);
    });

    /**
     * Create new object(s).
     */
    describe('create', function () {
        it('create a new object', function (done) {
            customerDao.createOne({name: 'customer test new 1'}, function (err, result) {
                    assert.equal(err, null);
                    assert.equal(result.name, 'customer test new 1');
                    done(err);
                }
            );
        });

        it('create multiple objects', function (done) {
            this.timeout(5000);
            customerDao.create([
                {name: 'customer 1'},
                {name: 'customer 2'},
                {name: 'customer 3'}
            ], function (err, data) {
                    assert.equal(err, null);
                    assert.equal(data.length, 3);
                    done(err);
                }
            );
        });
    });

    /**
     * Testing read functions.
     */
    describe('read', function () {
        it('get one object by identifier', function (done) {
            customerDao.getById('300000000000000000000001', function (err, result) {
                assert.equal(err, null);
                assert.equal(result.name, 'Customer 1');
                done(err);
            });
        });
        it('get all objects', function (done) {
            customerDao.all(function (err, results) {
                assert.equal(err, null);
                assert.equal(results.length, 2);
                done(err);
            });
        });
    });

    /**
     * Testing update functions.
     */
    describe('update', function () {
        it('update one object by identifier', function (done) {
            customerDao.updateById('300000000000000000000001', {name: 'heurk!'}, function (err, result) {
                assert.equal(err, null);
                assert.equal(result.name, 'heurk!');
                done(err);
            });
        });
    });


    /**
     * Testing delete functions.
     */
    describe('delete', function () {
        it('delete an object by identifier', function (done) {
            customerDao.removeById('300000000000000000000001', function (err, result) {
                assert.equal(err, null);
                assert.equal(result, true);
                done(err);
            });
        });
        it('delete multiple objects by identifier', function (done) {
            customerDao.remove(['300000000000000000000001', '300000000000000000000002'], function (err, result) {
                assert.equal(err, null);
                assert.equal(result[0], true);
                assert.equal(result[1], true);
                done(err);
            });
        });
    });


});
