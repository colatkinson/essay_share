var express = require("express");
var app = express();
var mongoose = require("mongoose");
var shortId = require('shortid');
var User = require('./user-model');

var port = (process.env.PORT || 3000);

var uri = "mongodb://localhost:27017/essay_share";
mongoose.connect(uri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
    var essaySchema = mongoose.Schema({
        _id: {
            type: String,
            unique: true,
            'default': shortId.generate
        },
        title: String,
        text: String,
        author: String
    });
    var Essay = mongoose.model("Essay", essaySchema);

    /*var testUser = new User({username: "colin", password: "test"});

    testUser.save(function(err) {
        if (err) throw err;

        // fetch user and test password verification
        User.findOne({ username: 'colin' }, function(err, user) {
            if (err) throw err;

            // test a matching password
            user.comparePassword('test', function(err, isMatch) {
                if (err) throw err;
                console.log('test:', isMatch); // -&gt; Password123: true
            });

            // test a failing password
            user.comparePassword('test1', function(err, isMatch) {
                if (err) throw err;
                console.log('test1:', isMatch); // -&gt; 123Password: false
            });
        });
    });*/

    /*User.findOne({username: "colin"}, function(err, user) {
        if (err) throw err;

        var testEssay = new Essay({author: user._id, title: "Test", text: "Test post plz ignore"});
        testEssay.save(function(err) {
            if (err) throw err;
        });
    });*/

    //var testEssay = new Essay({author: User.findOne({username: "colin"})});

    app.get("/", function(req, res) {
        res.send("<h1>Holla holla get dolla</h1>");
    });

    app.get("/api/essay/:id", function(req, res) {
        Essay.findOne({_id: req.params.id}, function(err, records) {
            if(err) {
                res.send("Benis :DDD");
                //res.end();
            }
            res.send(records);
        });
    });

    var server = app.listen(port, function() {
        console.log("Running!");
    });

});