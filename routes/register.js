var MongoClient = require('mongodb').MongoClient;
var crypto = require('crypto')

module.exports = function (app) {
    app.post('/register', function(req, res) {
        if(req.body.name && req.body.password && req.body.username) {


            var name = req.body.name;
            var username = req.body.username;
            var password = crypto.createHash('sha256').update(req.body.password.toString()).digest('base64');

            MongoClient.connect(
                // replace with the deployment uri
                'mongodb://localhost:27017/y2gutavY',
                function (err, db) {
                    if (err) {
                        res.status(500).json({status: 'error', message: 'internal server error'});
                    }
                    else {
                        var collection = db.collection('user');

                        collection.findOne({username:username}, function(err,item) {
                            if(err) {
                                res.status(500).json({status: 'error', message: 'internal server error'});
                            }
                            else {
                                if(item!=null) {
                                    db.close();
                                    //console.log("email_exists");
                                    res.status(600).json({status: 'error', message: 'username already exists'});
                                }
                                else {
                                    var credentials = {name: name, username: username, password: password};
                                    collection.insert(credentials,function(err, result){
                                        if(err) {
                                            db.close();
                                            res.status(500).json({status: 'error', message: 'internal server error'});
                                        }
                                        else {
                                            db.close();
                                            res.status(201).json({status: 'success', message: 'user created'});
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
};