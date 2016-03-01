// after add friend is done.

var MongoClient = require('mongodb').MongoClient;
var crypto = require('crypto');

module.exports = function(app) {
    app.post('/list', function(req, res) {
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
                        collection.findOne({username: username, password: password}, function (err, item) {
                            if (err) {
                                res.status(500).json({status: 'error', message: 'internal server error'});
                            }
                            else {
                                if (item) {
                                    // correct login
                                    var friends = db.collection('friend');
                                    var statuses = db.collection('status');

                                    var data = {username: username, friend: friendID};

                                    // if friendID is username
                                    if(username === friendID) {
                                        statuses.find({username: username}).sort({ $natural: -1}).toArray(function (err, data) {
                                            if (err) {
                                                res.status(500).json({status: 'error', message: 'internal server error'});
                                            }
                                            else {
                                                res.status(200).json({status: 'success', data: data});
                                            }
                                        });
                                    }
                                    else {
                                        friends.findOne({username: username, friend: friendID}, function (err, exists) {
                                            if (err) {
                                                res.status(500).json({
                                                    status: 'error',
                                                    message: 'internal server error'
                                                });
                                            }
                                            else {
                                                if (exists) {
                                                    statuses.find({username: friendID}).sort({ $natural: -1}).toArray(function (err, data) {
                                                        if (err) {
                                                            res.status(500).json({
                                                                status: 'error',
                                                                message: 'internal server error'
                                                            });
                                                        }
                                                        else {
                                                            res.status(200).json({status: 'success', data: data});
                                                        }
                                                    });

                                                }
                                                else {
                                                    // not friend
                                                    res.status(400).json({
                                                        status: 'error',
                                                        message: 'cannot list non friends'
                                                    })
                                                }

                                            }
                                        });
                                    }
                                }
                                else {
                                    db.close();
                                    res.status(401).json({status: 'error', message: 'invalid credentials'});
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
};

