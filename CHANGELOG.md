Changelog node.generic-dao-mongoose
===================================

## version 0.0.4 (01/23/2014)

* Externalize the "populator" in another node.js module : [node.populator-mongodb](https://github.com/9fevrier/node.populator-mongodb.git "A simple library used to populate a MongoDB database with native driver. Usefull for unit tests.")

## version 0.0.3 (01/23/2014)

* Implements `update` and `remove` methods.
* Add unit tests.

## version 0.0.2 (01/22/2014)

* Externalize generic `create` method in super-class `GenericDao` (see [node.generic-dao](https://github.com/9fevrier/node.generic-dao "GenericDao for node.js by SAS 9 Février")).
* Add unit tests to check the following methods :
    * `GenericDaoMongoose.getById` ;
    * `GenericDaoMongoose.create` ;
    * `GenericDaoMongoose.createOne`.

