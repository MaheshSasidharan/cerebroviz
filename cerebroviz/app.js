var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessions = require("client-sessions");
var cors = require('cors');

var routes = require('./routes/index');
//var routes = require('./cerebrovizApp/app/index');
var users = require('./routes/users');
var assessments = require('./routes/assessments');

var Helper = require('./CommonFactory/helper');
var DB = require('./CommonFactory/databaseManager');

var app = express();
//app.enable('trust proxy');
app.use(express.static(path.join(__dirname, 'cerebrovizApp', 'app')));

app.use(function(req, res, next) {
    // Website you wish to allow to connect    
    //res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8000');
    //res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');    
    //res.setHeader('Access-Control-Allow-Origin', '*');   
    if (req.headers.origin) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    } else {
        res.setHeader('Access-Control-Allow-Origin', "*");
    }
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type','x-forwarded-for');
    //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-forwarded-for');

    //res.setHeader('Access-Control-Allow-Headers', 'x-forwarded-for');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

/*
//cors({credentials: false, origin: true});
cors({credentials: true, origin: true});
app.use(cors());
*/

app.use(sessions({
    cookieName: 'session', // cookie name dictates the key name added to the request object
    secret: Helper.GUID(), // should be a large unguessable string
    duration: 30 * 24 * 60 * 60 * 1000, //(1 month) how long the session will stay valid in ms
    activeDuration: 30 * 24 * 60 * 60 * 1000 //(1 month) if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));

app.use(function(req, res, next) {    
    if (req.method !== "OPTIONS") {
        if (req.session && req.session.id) {
            DB.FindUser(req.session.id, res, function(err, id) {
                if (err) throw err;
                if (id) {
                    //req.user = user;
                    //req.session.id = id;  //refresh the session value
                    //res.locals.user = user;
                    req.session.id = 1; // For development, use userID 1
                    //res.locals.id = 1;
                    res.setHeader('X-Seen-You', 'true');
                    //finishing processing the middleware and run the route
                    next();
                } else {
                    // Valid session has id, but that id is not valid
                    res.json({ code: 100, status: false, msg: "Error in connection database" });
                }
            });
        } else {
            var sIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip || req.headers.origin || req.ips;            
            if (!sIP) {
                sIP = "IP NOT RETRIEVED";
            }
            DB.AddUser({ sessionId: Helper.GUID(), ip: sIP }, res, function(err, id) {
                if (id) {
                    //req.session.id = id;
                    req.session.id = 1; // For development, use userID 1                    
                    res.setHeader('X-Seen-You', 'false'); // Seeing you for the first time
                }
                next();
            });
        }
    } else {
        next();
    }
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


app.use(cookieParser());
app.use('/users', users);
app.use('/assessments', assessments);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.json({ code: err.status || 500, msg: err.message });
        /*
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
        */
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.json({ code: err.status || 500, msg: err.message });
    /*
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
    */
});

module.exports = app;
