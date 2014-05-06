/* jshint browser: true */
/* global describe, it, before, after, beforeEach, afterEach */
/* global chai */

var should = chai.should();

'indexedDB' in window && describe('indexddb', function () {

    var db;
    var dbName = "testing";
    var dbVersion = "1";

    beforeEach("open db", function (done) {
        var req = window.indexedDB.open(dbName, dbVersion);

        req.onupgradeneeded = function (e) {
            var db = e.target.result;

            db.createObjectStore('people', {
                keyPath: 'id',
                autoIncrement: true
            });

        };

        req.onsuccess = function (e) {
            db = e.target.result;
            done();
        };

        req.onerror = done;
    });

    afterEach("close db", function () {
        db.close();
    });

    after("should destroy database schema", function (done) {
        var req = window.indexedDB.deleteDatabase(dbName);

        req.onsuccess = function (e) {
            done();
        };

        req.onerror = done;
    });


    it("should add person", function (done) {
        var tx = db.transaction(["people"], "readwrite");

        var req = tx.objectStore("people").add({
            name: "hans"
        });
        req.onsuccess = function (e) {
            e.target.result.should.equal(1);
        };

        tx.oncomplete = function (e) {
            done();
        };

        tx.onerror = done;
    });

    it("should get person", function (done) {
        var tx = db.transaction(["people"], "readonly");

        var req = tx.objectStore("people").get(1);
        req.onsuccess = function (e) {
            e.target.result.should.deep.equal({
                id: 1,
                name: "hans"
            });
        };

        tx.oncomplete = function (e) {
            done();
        };

        tx.onerror = done;
    });

    it("should remove person", function (done) {
        var tx = db.transaction(["people"], "readwrite");

        var req = tx.objectStore("people")['delete'](1);
        req.onsuccess = function (e) {
            should.not.exist(e.target.result);
        };

        tx.oncomplete = function (e) {
            done();
        };

        tx.onerror = done;
    });

});