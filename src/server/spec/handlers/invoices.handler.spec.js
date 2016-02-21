var proxyquire = require("proxyquire");
var R = require('ramda');

describe("Invoices handler", function() {
       
    describe("getNextNumber", function() {
        var invoiceModelMock = {
            data: undefined,
            find: function(query) {
                this.data = [{number: 1}, {number: 2}, {number: 3}, {number: 4}, {number: 10}, {number: 11}, {number: 12}];
                return this;
            },
            sort: function(sortQuery) {
                this.data = R.sortBy(R.prop('number'), this.data);
                
                if (sortQuery.number == -1) {
                    this.data = R.reverse(this.data);
                }
                
                return this;
            },
            limit: function(count) {
                return this;
            },
            exec: function(callback) {
                callback(undefined, this.data);
            }
        };
        
        var invoiceHandlerMock;
        
        beforeEach(function() {
           invoiceHandlerMock = proxyquire('../../handlers/invoices.handler.js', { '../models/invoice.js': invoiceModelMock }) 
        });
        
        it("should return next available number, not next bigger number", function(done) {
            invoiceHandlerMock.getNextNumber().then(function(data) {
               expect(data).toBe(5);
               done(); 
            });
        })
    })
});