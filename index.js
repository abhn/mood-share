var app = require('express')();
var bodyParser = require('body-parser');

// for form
app.use(bodyParser.urlencoded({extended:false}));

var register = require('./routes/register.js')(app);
var login = require('./routes/login.js')(app);
var update = require('./routes/update_mood.js')(app);
var list = require('./routes/list_mood.js')(app);
var add = require('./routes/add_friend.js')(app);
var friends = require('./routes/list_friends.js')(app);
var listone = require('./routes/listone_mood.js')(app);

// Proof that I suck
//var listonetest = require('./routes/making_listone')(app);

app.set('port',process.env.PORT || 8081);

app.listen(app.get('port'),function(){
    console.log('listening on port: '+app.get('port'));
});
