var MongoClient = require('mongodb').MongoClient;
var crypto = require('crypto');
var moment = require('moment');

module.exports = function(app) {
    app.post('/update', function (req, res) {
        if(req.body.status && req.body.username && req.body.password) {
            var username = req.body.username;
            var password = crypto.createHash('sha256').update(req.body.password).digest('base64');
            var status = req.body.status;

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

                                    var statuses = db.collection('status');
                                    var credentials = {name: item['name'], username: username, status: status, date: moment().utcOffset(330).format("Do MMM, YYYY"),
                                        time: moment().utcOffset(330).format("h:mm A")};
                                    statuses.insert(credentials, function (err, result) {
                                        if(err) {
                                            db.close();
                                            res.status(500).json({status: 'error', message: 'internal server error'});
                                        }
                                        else {
                                            db.close();
                                            res.status(201).json({status: 'success', message: 'status updated'});
                                        }
                                    })
                                }
                                else {
                                    db.close();
                                    res.status(401).json({status: 'error', message: 'invalid credentials'});
                                }
                            }
                        });
                    }
                }
            );
        }
        else {
            res.status(400).json({status: 'error', message: 'illegal request'});
        }
    });
    app.get('/register', function(req, res) {
        res.status(405).json({status: 'error', message: 'post request expected'});
    });
};