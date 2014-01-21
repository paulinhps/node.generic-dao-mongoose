'use strict;';

var mongoose = require('mongoose'),
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

CustomerSchema.pre('save', function(next) {
    this.modificationTimestamp = new Date();
    next();
});

var CustomerModel = db.model('Customer', CustomerSchema);

var CustomerDao = GenericDaoMongoose.augment({
    constructor: function() {
        GenericDaoMongoose.call(this);
    }
});
var customerDao = new CustomerDao();
customerDao.setModelClass(CustomerModel);

describe("Customers", function() {
    it("create a new customer", function(done){
        customerDao.createOne({_id: '100000000000000000000001', name: 'customer test new 1'}, function(err, data) {
                assert.equal(data.name, 'customer test new 1');
                done();
            }
        );
    });
});
