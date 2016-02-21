// var product = require("../../models/product"),
//     productHandler = require("../../handlers/products.handler.js");
// 
// describe("Products handler", function() {
//   it ("should be possible to get", function() {
//     expect(productHandler.get).toBeDefined();
//   });
// 
//   describe(" get", function() {
//     var _deferred, _product, _error;
//     var productMock = {_id: 1};
// 
//     beforeEach(function(done) {
//       spyOn(product, 'find').andCallFake(function(query, cb) {
//         cb(null, [{ _id: query._id }]);
//       });
// 
//       _deferred = productHandler.get(1).then(function(doc) {
//         _product = doc;
//       }, function(err) {
//         _error = err;
//       }).finally(function() {
//         done();
//       });
//     });
// 
//     it("should provide a deferred", function(){
//       expect(_deferred).toBeDefined();
//     });
// 
//     it("should be a success", function() {
//       expect(_error).toBeUndefined();
//     });
// 
//     it("should return only one product", function() {
//       expect(_product).toBeDefined();
//     });
//   });
// 
//   it ("should be possible to query", function() {
//     expect(productHandler.query).toBeDefined();
//   });
// 
//   describe("query", function() {
//     var queryMock = { search: undefined, pageSize: 10, page: 1, orderBy: "label", orderByDirection: 1 };
//     var  _deferred, _result, _error;
// 
//     beforeEach(function(done) {
//       _deferred = productHandler.query(queryMock).then(function(result) {
//         _result = result;
//       }, function(err) {
//         _error = err;
//       }).finally(function() {
//         done();
//       });
//     });
// 
//     it("should provide a deferred", function(){
//       expect(_deferred).toBeDefined();
//     });
// 
//     it("should be a success", function() {
//         expect(_error).toBeUndefined();
//     });
// 
//     it("should return a result that contains data and a total count", function() {
//         expect(_result.data).toBeDefined();
//         expect(_result.count).toBeDefined();
//     });
// 
//     it("should return 10 first products", function() {
//       expect(_result.data.length).toBe(10);
//       expect(_result.count).toBeGreaterThan(_result.data.length);
//     });
//   });
// 
//   it ("should be possible to post", function() {
//     expect(productHandler.post).toBeDefined();
//   });
// 
//   describe("post", function() {
//     var _deferred, _product, _error;
//     var productMock = { label: "bla" };
// 
//     beforeEach(function(done) {
//       spyOn(product, 'insert').andCallFake(function(p, cb) {
//         cb(null, p);
//       });
// 
//       _deferred = productHandler.post(productMock).then(function(doc) {
//         _product = doc;
//       }, function(err) {
//         _error = err;
//       }).finally(function() {
//         done();
//       });
//     });
// 
//     it("should provide a deferred", function(){
//       expect(_deferred).toBeDefined();
//     });
// 
//     it("should be a success", function() {
//       expect(_error).toBeUndefined();
//     });
// 
//     it("should return added product", function() {
//       expect(_product).toBeDefined();
//     });
//   });
// 
//   it ("should be possible to put", function() {
//     expect(productHandler.put).toBeDefined();
//   });
// 
//   describe("put", function() {
//     var _deferred, _id, _error, _query;
//     var productMock = { _id: 1, label: "bla" };
// 
//     beforeEach(function(done) {
//       spyOn(product, 'update').andCallFake(function(query, p, smth, cb) {
//         _query = query;
//         cb(null, p._id);
//       });
// 
//       _deferred = productHandler.put(productMock).then(function(id) {
//         _id = id;
//       }, function(err) {
//         _error = err;
//       }).finally(function() {
//         done();
//       });
//     });
// 
//     it("should provide a deferred", function(){
//       expect(_deferred).toBeDefined();
//     });
// 
//     it("should be a success", function() {
//       expect(_error).toBeUndefined();
//     });
// 
//     it("should return id of modified product", function() {
//       expect(_id).toBeDefined();
//       expect(_id).toBe(productMock._id);
//     });
//   });
// 
//   it ("should be possible to remove", function() {
//     expect(productHandler.remove).toBeDefined();
//   });
// 
//   describe("remove", function() {
//     var _deferred, _countDeleted, _error, _query;
//     var productMock = { _id: 1, label: "bla" };
// 
//     beforeEach(function(done) {
//       spyOn(product, 'remove').andCallFake(function(query, smth, cb) {
//         _query = query;
//         cb(null, 1);
//       });
// 
//       _deferred = productHandler.put(productMock).then(function(countDeleted) {
//         _countDeleted = countDeleted;
//       }, function(err) {
//         _error = err;
//       }).finally(function() {
//         done();
//       });
//     });
// 
//     it("should provide a deferred", function(){
//       expect(_deferred).toBeDefined();
//     });
// 
//     it("should be a success", function() {
//       expect(_error).toBeUndefined();
//     });
// 
//     it("should delete one element", function() {
//       expect(_countDeleted).toBeDefined();
//       expect(_countDeleted).toBe(1);
//     });
//   });
// 
// });
