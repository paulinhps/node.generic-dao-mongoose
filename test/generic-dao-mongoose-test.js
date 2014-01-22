'use strict;';

var DbPopulator = require('./utils/populator'),
    mongoose = require('mongoose'),
    assert = require('assert'),
    GenericDaoMongoose = require('../lib/generic-dao-mongoose');

var dbUri = 'mongodb://localhost/dao';
var db = mongoose.createConnection(dbUri);

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

/**
 * Unit tests to validate GenericDaoMongoose.
 */
describe('Customers test', function () {

    /**
     * Before each test, drop the collection then populate.
     */
    beforeEach(function (done) {
        this.timeout(3000);
        var populator = new DbPopulator('../testing-data', dbUri);
        populator.populate(done);
    });

    /**
     * Create new object(s).
     */
    describe('create', function () {
        it('create a new object', function (done) {
            customerDao.createOne({name: 'customer test new 1'}, function (err, data) {
                    assert.equal(data.name, 'customer test new 1');
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
                    assert.equal(data.length, 3);
                    done(err);
                }
            );
        });
    });

    /**
     *
     */
    describe('get', function () {
        it('get one record by identifier', function(done) {
            customerDao.getById('300000000000000000000001', function(err, result) {
                assert.equal(result.name, 'Customer 1');
                done(err);
            });
        });

    });

});
