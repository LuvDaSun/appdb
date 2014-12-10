/* jshint browser: true */
/* global describe, it, before, after, beforeEach, afterEach */
/* global chai */

var should = chai.should();

'openDatabase' in window && describe('websql', function () {

    var db;
    var dbName = "testing";
    var dbVersion = "1";
    var dbSize = 5 * 1024 * 1024;

    beforeEach("should open database", function () {
        db = window.openDatabase(dbName, "", dbName, dbSize);
    });

    beforeEach("should upgrade database", function (done) {

        if (db.version === dbVersion) return done();

        db.changeVersion(db.version, dbVersion, function (tx) {

            tx.executeSql("CREATE TABLE people(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)", []);

        }, done, function () {
            db.version.should.equal(dbVersion);
            done();
        });
    });

    after("should drop database schema", function (done) {
        if (db.version === "") return done();

        db.changeVersion(db.version, "", function (tx) {

            tx.executeSql("DROP TABLE people", []);

        }, done, function () {
            db.version.should.equal("");
            done();
        });
    });


    it("should add person", function (done) {
        db.transaction(function (tx) {

            tx.executeSql("INSERT INTO people(name) VALUES(?)", ["hans"], function (tx, result) {
                result.rowsAffected.should.equal(1);
                result.insertId.should.equal(1);
            });

        }, done, function () {
            done();
        });
    });

    it("should get person", function (done) {
        db.readTransaction(function (tx) {

            tx.executeSql("SELECT * FROM people WHERE id = ?", [1], function (tx, result) {
                result.rows.length.should.equal(1);
                result.rows.item(0).should.deep.equal({
                    id: 1,
                    name: "hans"
                });
            });

        }, done, function () {
            done();
        });
    });

    it("should remove person", function (done) {
        db.transaction(function (tx) {

            tx.executeSql("DELETE FROM people WHERE id = ?", [1], function (tx, result) {
                result.rowsAffected.should.equal(1);
            });

        }, done, function () {
            done();
        });
    });

});