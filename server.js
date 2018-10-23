// const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const accountSid = 'AC786b3940a7a57e9e11afff82bef9380d';
const authToken = 'd24866e3dc6dc5880d7a234dce9ad82f';
var PouchDB = require("pouchdb");
PouchDB.plugin(require('relational-pouch'));
const client = require('twilio')(accountSid, authToken);

var http = require('http');
const app = express();
//var database = new PouchDB("http://sarutech:Sarutobi2014@sarutech.com:5984/weverify");
var database = new PouchDB("http://142.93.106.233:5984/weverify:adminverify123:5984/weverify");

database.setSchema([
    {
        singular: 'user',
        plural: 'users',
        relations: {
            idcards: {
                hasMany: {
                    type: 'idcard',
                    options: {
                        async: true
                    }
                },
            },
            voters: {
                hasMany: {
                    type: 'voters',
                    options: {
                        async: true
                    }
                },
            },
            licences: {
                hasMany: {
                    type: 'licence',
                    options: {
                        async: true
                    }
                },
            },
            passports: {
                hasMany: {
                    type: 'passport',
                    options: {
                        async: true
                    }
                },
            },
            otherss: {
                hasMany: {
                    type: 'others',
                    options: {
                        async: true
                    }
                },
            },
            bankstatements: {
                hasMany: {
                    type: 'bankstatement',
                    options: {
                        async: true
                    }
                },
            }
        }
    },

    /*for payment*/
    {
        singular: 'payment',
        plural: 'payments'
    },
    {
        singular: 'idcard',
        plural: 'idcards',
        relations: {
            user: {
                belongsTo: 'user'
            },
        }
    },
    {
        singular: 'bankstatement',
        plural: 'bankstatements',
        relations: {
            user: {
                belongsTo: 'user'
            },
        }
    },
    {
        singular: 'licence',
        plural: 'lincences',
        relations: {
            user: {
                belongsTo: 'user'
            },
        }
    },
    {
        singular: 'voter',
        plural: 'voters',
        relations: {
            user: {
                belongsTo: 'user'
            },
        }
    },
    {
        singular: 'passport',
        plural: 'passports',
        relations: {
            user: {
                belongsTo: 'user'
            },
        }
    },
    {
        singular: 'others',
        plural: 'otherss',
        relations: {
            user: {
                belongsTo: 'user'
            },
        }
    },
    /*for settings*/
    {
        singular: 'setting',
        plural: 'settings'
    }
]);

console.log(database);
//const users = require('./routes/users');
//const apis = require('./routes/apis');
const port = process.env.PORT || 3000;
app.use(cors());


app.get("/User/:id", function (req, res) {
    console.log(req.params.id)
    if (!req.params.id) {
        return res.status(400).send({ "status": "error", "message": "An `id` is required" });
    }
    database.get('user_2_' + req.params.id).then(function (result) {
        res.json(result);
    }, function (error) {
        res.status(400).send(error);
    });
});

app.get("/User", function (req, res, next) {
    console.log('test');
});
app.delete("/User", function (req, res) { });
app.get("/Userss", function (req, res) {
    database.allDocs({ include_docs: true }).then(function (result) {
        res.send(result.rows.map(function (item) {

            //result.rows = result.rows.filter(data => data._id.substring(0, 4) == 'user');
            //console.log(result.rows[8]._id);
            console.log(result.rows);
            return item.doc;
        }));
    }, function (error) {
        res.status(400).send(error);
    });
});

app.get('/sendsms', function (req, res, next) {
    client.messages.create({
        to: '+2348134491142',
        from: '+14023829172',
        body: 'My first twilio message'
    }).then((message) => console.log(message.sid)).done();

})


app.get("/Users", function (req, res, next) {
    var isTrue = { 'status': 'true', 'message': 'Logged in successfully' }
    var isFalse = { 'status': 'false', 'message': 'Wrong Username/Password' }

    database.rel.find('user').then(result => {
        console.log(result);
        for (i = 0; i < result.users.length; i++) {
            console.log(result.users[i].username);
            if (result.users[i].username == 'tola' && result.users[i].password == 'tola') {
                console.log('true');
                result.users = result.users.filter(user => user.username == 'tola' && user.password == 'tola')
            }
            else {
                console.log('false');
                result.users = result.users.filter(user => user.username == 'tola' && user.password == 'tola')
            }

        }
        console.log(result.users)
        if (result.users.length > 0) {
            result.users.push(isTrue);
            res.json(result.users)
        }
        else if (result.users.length == 0) {
            res.status(400).send(isFalse);
        }
    })
})

/* res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS'); */

// Set Static Folder
app.use(express.static(path.join(__dirname, 'www')));

// Body Parser Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
//app.use('/users', users);
//app.use('/apis', apis);

//app.use(require('/user-route'))

app.get('/', (req, res) => {
    res.send("Invalid End Point");
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'www/index.html'));
})


/* app.listen(port, () => {
    console.log("Server started on port " + port);
}) */

http.createServer(app).listen(port, function (err) {
    console.log('listening in http://localhost:' + port);
    database.info().then(function (info) {
        console.log(info);
    });
});

app.post("/adduser", function (req, res, next) {
    console.log(req.body);
    var isTrue = { 'status': 'true', 'message': 'Logged in successfully' }
    var isFalse = { 'status': 'false', 'message': 'Wrong Username/Password' }

    database.rel.find('user').then(result => {
        console.log(result);
        for (i = 0; i < result.users.length; i++) {
            console.log(result.users[i].username);
            if (result.users[i].username == req.body.username && result.users[i].password == req.body.password) {
                console.log('true');
                result.users = result.users.filter(user => user.username == req.body.username && user.password == req.body.password)
            }
            else {
                console.log('false');
                result.users = result.users.filter(user => user.username == req.body.username && user.password == req.body.password)
            }

        }
        console.log(result.users)
        if (result.users.length > 0) {
            result.users.push(isTrue);
            res.json(result.users)
        }
        else if (result.users.length == 0) {
            res.status(400).send(isFalse);
        }
    })
})

