'use strict;';

var ObjectID = require('mongodb').ObjectID;
var DBRef = require('mongodb').DBRef;

var getDBRef = function(collectionName, id) {
    return new DBRef(collectionName, id, 'dao');
};

module.exports = {
    customer: [
        {_id: new ObjectID("123456789012"), name: "Customer 1" },
        {_id: new ObjectID("123456789013"), name: "Customer 2" }
    ]};
