var MongoClient = require('mongodb').MongoClient;
var crypto = require('crypto');

module.exports = function (app) {
    app.post('/login', function (req, res) {
        if (req.body.password && req.body.username) {

            var username = req.body.username;
            var password = crypto.createHash('sha256').update(req.body.password).digest('base64');

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
                                    db.close();
                                    res.status(202).json({status: 'success', message: 'user logged in'});
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
    });

    app.get('/login', function(req, res) {
        res.status(405).json({status: 'error', message: 'post request expected'});
    });
};