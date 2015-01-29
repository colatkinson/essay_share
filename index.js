var express = require("express");
var app = express();
var mongoose = require("mongoose");
var shortId = require('shortid');
var User = require('./user-model');
var swig  = require('swig');

var loremIpsum = require("lorem-ipsum");

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
        date: {
            type: Date,
            'default': Date.now
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

        var testEssay = new Essay({author: user._id, title: "Longest Illuminati Code", text: loremIpsum({count: 20, units: 'paragraphs'})});
        testEssay.save(function(err) {
            if (err) throw err;
        });
    });*/

    //var testEssay = new Essay({author: User.findOne({username: "colin"})});

    /*app.get("/", function(req, res) {
        res.send("<h1>Holla holla get dolla</h1>");
    });*/
    app.use(express.static(__dirname + '/app'));

    app.get("/api/essay/:id.json", function(req, res) {
        Essay.findOne({_id: req.params.id}, function(err, record) {
            if(err) {
                res.send("Benis :DDD");
                throw err;
            }
            User.findOne({_id: record.author}, function(err, record2) {
                var obj = {
                    id: record._id,
                    author: record2.username,
                    date: record.date,
                    title: record.title,
                    text: record.text
                };
                res.send(obj);
            });
        });
    });

    app.get("/api/essays.json", function(req, res) {
        var num = (parseInt(req.query.num) || 20);
        var searchObj = {};
        if(req.query.from) {
            searchObj = { date: { $lt: req.query.from } };
        };
        if(req.query.search) {
            var obj = {$regex: req.query.search.split(" ").join("|"), $options: "i"};
            searchObj.$or = [{text: obj}, {title: obj}];
        };
        Essay.find(searchObj).sort({date: "desc"}).limit(num).exec(function(err, records) {
            if(err) {
                res.send("It's fucked");
                throw err;
            }

            var returnObj = [];
            if(records.length > 0) {
                records.forEach(function(record, index, array) {
                    User.findOne({_id: record.author}, function(err, records2) {
                        if(err) throw err;
                        returnObj.push({
                            id: record._id,
                            author: records2.username,
                            date: record.date,
                            title: record.title,
                            text: record.text.substring(0, 25)+"..."
                        });
                        if(returnObj.length == array.length) {
                            res.send(returnObj);
                        }
                    });
                });
            } else {
                res.send({});
            }
        });
    });

    app.get("/e/:id", function(req, res) {
        Essay.findOne({_id: req.params.id}, function(err, records) {
            if(err) {
                res.send("Benis :DDD");
                //res.end();
            }
            var t = swig.renderFile('templates/essay.swig', {
                title: records.title,
                paragraphs: records.text.split("\n")
            });
            res.send(t);
        });
    });

    var server = app.listen(port, function() {
        console.log("Running!");
    });

});