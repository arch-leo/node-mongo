"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var router = require("./routes/router");
var app = express();
// cross-origin handler
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
// post data handler    json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// router handler
app.use('/', router);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.send('404');
});
app.listen(3000, function () {
    console.log('服务器正在运行... 端口为：3000');
});
