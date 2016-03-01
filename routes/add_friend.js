var MongoClient = require('mongodb').MongoClient;
var crypto = require('crypto');

module.exports = function(app) {
    app.post('/add', function(req, res) {
        if(req.body.username && req.body.password && req.body.friend) {
            var username = req.body.username;
            var password = crypto.createHash('sha256').update(req.body.password).digest('base64');
            var friendID = req.body.friend;

            MongoClient.connect(
                // replace with the deployment uri
                'mongodb://localhost:27017/y2gutavY',
                function (err, db) {
                    if (err) {
                        res.status(500).json({status: 'error', message: 'internal server error'});
                    }
                    else {
                        var collection = db.collection('user');

                        // search friend id and report if non existant
                        collection.findOne({username: friendID}, function(err, exists) {
                            if(err) {
                                res.status(500).json({status: 'error', message: 'internal server error'});
                            }
                            else {
                                if(!exists) {
                                    db.close();
                                    res.status(400).json({status: 'error', message: 'friend doesn\'t exist'});
                                }
                                else {
                                    collection.findOne({username: username, password: password}, function (err, item) {
                                        if (err) {
                                            res.status(500).json({status: 'error', message: 'internal server error'});
                                        }
                                        else {
                                            if (item) {
                                                // correct login
                                                var friends = db.collection('friend');
                                                var data = {username: username, friend: friendID};
                                                friends.findOne({username: username, friend: friendID}, function(err, exists) {
                                                    if(err) {
                                                        res.status(500).json({status: 'error', message: 'internal server error'});
                                                    }
                                                    else {
                                                        if(exists) {
                                                            db.close();
                                                            res.status(690).json({status: 'error', message: 'Because you\'re a dickhead'});
                                                        }
                                                        else {
                                                            friends.insert(data, function(err, result) {
                                                                // I, Abhishek Nagekar, accept to be called a God
                                                                if(err) {
                                                                    db.close();
                                                                    res.status(500).json({status: 'error', message: 'internal server error'});
                                                                }
                                                                else {
                                                                    db.close();
                                                                    res.status(201).json({status: 'success', message: 'friend added successfully'});
                                                                }
                                                            });
                                                        }
                                                    }
                                                });
                                            }
                                            else {
                                                db.close();
                                                res.status(401).json({status: 'error', message: 'invalid credentials'});
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
        }
        else {
            res.status(400).json({status: 'error', message: 'illegal request'});
        }
    });

    app.get('/register', function(req, res) {
        res.status(405).json({status: 'error', message: 'post request expected'});
    });
}