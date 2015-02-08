var express = require("express");
var app = express();
var mongoose = require("mongoose");
var shortId = require('shortid');
var User = require('./user-model');
var swig  = require('swig');
var flash = require('connect-flash');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var fs = require("fs");

var secretsFile = require("./secret-config.json");

//var loremIpsum = require("lorem-ipsum");

var port = (process.env.PORT || 3000);

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var auth = function(req, res, next) {
    if (!req.isAuthenticated())
        res.sendStatus(401);
    else
        next();
};

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



    app.use(expressSession({secret: secretsFile.sessionSecret, saveUninitialized: true, resave: true}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use( bodyParser.json() );       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));
    //app.use(express.cookieSession({ secret: 'tobo!', maxAge: 360*5 }));

    passport.serializeUser(function(user, done) {
        /*console.log('serializing user: ');
        console.log(user);*/
        done(null, user._id);
    });
 
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy(
        function(username, password, done) {
          User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
              return done(null, false, { message: 'Incorrect username.' });
            }
            /*if (!user.validPassword(password)) {
              return done(null, false, { message: 'Incorrect password.' });
            }*/
            comparePassword(password, user, function(err, isMatch) {
                if(!isMatch) {
                    console.log("Bad password");
                    return done(null, false, { message: 'Incorrect password.' });
                } else {
                    return done(null, user);
                }
            });
            //return done(null, user);
          });
        }
    ));
    /*passport.use('login', new LocalStrategy({
        passReqToCallback : true
      },
      function(req, username, password, done) { 
        console.log(req);
        // check in mongo if a user with username exists or not
        User.findOne({ 'username' :  username }, 
          function(err, user) {
            // In case of any error, return using the done method
            if (err)
              return done(err);
            // Username does not exist, log error & redirect back
            if (!user){
              console.log('User Not Found with username '+username);
              return done(null, false, 
                    req.flash('message', 'User Not found.'));                 
            }
            // User exists but wrong password, log the error 
            if (!isValidPassword(user, password)){
              console.log('Invalid Password');
              return done(null, false, 
                  req.flash('message', 'Invalid Password'));
            }
            // User and password both match, return user from 
            // done method which will be treated like success
            return done(null, user);
          }
        );
    }));*/
    var comparePassword = function(candidatePassword, user, cb) {
        bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
            if (err) return cb(err);
            console.log(user.password, candidatePassword);
            cb(null, isMatch);
        });
    };

    /*app.get('/', function(req, res) {
        // Display the Login page with any flash message, if any
        app.render(__dirname+'/app/index', { message: req.flash('message') });
    });*/

    //app.use(express.static(__dirname + '/app'));

    app.post('/loginReq',
        passport.authenticate('local', { failureRedirect: '/login',
                                         failureFlash: true }),
            function(req, res) {
                console.log(req.body);
                if(req.body.pastPath == "")
                    res.redirect("/");
                else
                    res.redirect(req.body.pastPath);
            }
    );

    passport.use('signup', new LocalStrategy({
        passReqToCallback : true
      },
      function(req, username, password, done) {
        console.log(password, req.body.password_conf);
        findOrCreateUser = function(){
          if(password != req.body.password_conf) {
            console.log("Passwords don't match");
            return done(null, false, req.flash('message', 'Passwords don\'t match!'));
          }
          // find a user in Mongo with provided username
          User.findOne({'username':username},function(err, user) {
            // In case of any error return
            if (err){
              console.log('Error in SignUp: '+err);
              return done(err);
            }
            // already exists
            if (user) {
              console.log('User already exists');
              return done(null, false, 
                 req.flash('message','User Already Exists'));
            } else {
              // if there is no user with that email
              // create the user
              var newUser = new User();
              // set the user's local credentials
              newUser.username = username;
              //newUser.password = createHash(password);
              newUser.password = password;
              newUser.email = req.body.email;
              //newUser.firstName = req.param('firstName');
              //newUser.lastName = req.param('lastName');
     
              // save the user
              newUser.save(function(err) {
                if (err){
                  console.log('Error in Saving user: '+err);  
                  throw err;  
                }
                console.log('User Registration succesful');    
                return done(null, newUser);
              });
            }
          });
        };
         
        // Delay the execution of findOrCreateUser and execute 
        // the method in the next tick of the event loop
        process.nextTick(findOrCreateUser);
      })
    );
    app.post('/signupReq', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash : true 
  }));
    /*var failRedirect = "/#/login";
    var successRedirect = "/";
    app.post('/login', 
    passport.authenticate('login', { failureRedirect: failRedirect, failureFlash: false }),
            function(req, res) {
                console.log(req.user.username+' is successfully logged in.');
                console.log(JSON.stringify(req.user));
                res.redirect(successRedirect);
            });/*
    app.post("/login", function(req, res) {
        console.log(req.body);
    });*/

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

    app.post('/submitReq', function(req, res) {
        /*console.log(req.body);
        console.log(req.isAuthenticated());
        console.log(req.user._id);*/
        if(req.isAuthenticated()) {
            var testEssay = new Essay({author: req.user._id, title: req.body.title, text: req.body.content});
            testEssay.save(function(err) {
                if (err) throw err;
                res.redirect("/essay/" + testEssay._id);
            });
        } else {
            res.redirect("/login");
        }
        /*if(req.body.pastPath == "")
            res.redirect("/");
        else
            res.redirect(req.body.pastPath);*/
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

    app.get("/api/user/:name.json", function(req, res) {
        User.findOne({username: req.params.name}, function(err, record) {
            if(err) {
                res.send(500, "Error occurred");
                throw err;
            }
            var returnObj = {
                username: record.username,
                email: record.email,
                essays: []
            }
            console.log("user: ", req.user, "record: ", record._id);
            if(!req.user || (req.user._id != record._id)) {
                returnObj.email = "";
            }
            Essay.find({author: record._id}).sort({date: "desc"}).exec(function(err, records) {
                if(err) {
                    res.sendStatus(500, "Error occurred");
                    throw err;
                }
                if(records.length > 0) {
                    records.forEach(function(record2, index, array) {
                        returnObj.essays.push({
                            id: record2._id,
                            title: record2.title,
                            date: record2.date,
                            text: record2.text.substring(0, 25)+"..."
                        });

                        if(returnObj.essays.length == array.length) {
                            res.send(returnObj);
                        }
                    });
                } else {
                    res.send(returnObj);
                }
            });

            //res.send(record);
        })
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

    app.get('/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    app.post('/logoutReq', function(req, res){
        console.log("Logging out!");
        req.logOut();
        res.sendStatus(200);
    });

    var server = app.listen(port, function() {
        console.log("Running!");
    });

    app.use('/bower_components', express.static(__dirname + '/app/bower_components'));
    app.use('/css', express.static(__dirname + '/app/css'));
    app.use('/js', express.static(__dirname + '/app/js'));
    app.use('/partials', express.static(__dirname + '/app/partials'));

    app.all('/*', function(req, res, next) {
        // Just send the index.html for other files to support HTML5Mode
        res.sendFile('/app/index.html', { root: __dirname });
    });

});