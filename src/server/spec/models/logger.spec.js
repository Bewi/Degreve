var logger = require('../../models/logger.js');
var loggerHandler = require('../../handlers/logger.handler.js');

describe("logger handler",function () {
  var _err, _doc, _callback;

  beforeEach(function () {
    _callback = createSpy().andCallFake(function(err, doc) { _err = err; _doc = doc; });

    spyOn(loggerHandler, 'log').andCallThrough();
    spyOn(logger, 'insert').andCallFake(function(doc, cb){
      cb(null, doc);
    });
  });

  it("should be able to log", function () {
    expect(loggerHandler.log).toBeDefined();
  });

  describe("log", function () {
    var message = "message";
    beforeEach(function () {
      loggerHandler.log("none", message, _callback);
    });

    it('should log to nedb', function () {
      expect(logger.insert).toHaveBeenCalled();
    });

    it('should have called the callback', function () {
      expect(_callback).toHaveBeenCalled();
    });

    it('should have inserted a message', function () {
      expect(_doc).toBeDefined();
    });
  });

  it("should be able to log an error", function () {
    expect(loggerHandler.error).toBeDefined();
  });

  describe("error", function () {
    var errorMessage = "error message";
    beforeEach(function () {
      loggerHandler.error(errorMessage, _callback);
    });

    itShouldLog("error", "error message");
  });

  it("should be able to log an warning", function () {
    expect(loggerHandler.warn).toBeDefined();
  });

  describe("warn", function () {
    var warningMessage = "warning message";
    beforeEach(function () {
      loggerHandler.warn(warningMessage, _callback);
    });

    itShouldLog("warning", warningMessage);
  });

  it("should be able to notify", function () {
    expect(loggerHandler.notify).toBeDefined();
  });

  describe("notify", function () {
    var infoMessage = "info message";

    beforeEach(function () {
      loggerHandler.notify(infoMessage, _callback);
    });

    itShouldLog("info", infoMessage);
  });

  function itShouldLog (type, message) {
    it('should log', function () {
      expect(loggerHandler.log).toHaveBeenCalled();
    });

    it('should log one message', function () {
      expect(loggerHandler.log.calls.length).toEqual(1);
    });

    it('should log an '+ type + ' message', function () {
      expect(loggerHandler.log).toHaveBeenCalledWith(type, message, _callback);
    });

    it('should have inserted the correct ' + type +' message', function () {
      expect(_doc).toBeDefined();
      expect(_doc.type).toBe(type);
      expect(_doc.message).toBe(message);
      expect(_doc.date).toBeDefined();
    });
  }
});
