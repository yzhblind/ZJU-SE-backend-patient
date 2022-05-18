var PORT = 8080

var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

var isProduction = process.env.NODE_ENV === 'production';

var app = express();

// use express.json middleware to parse the JSON in the request body
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// mount routes to solve requests from front end 
app.use('/api/user', require('./routes'));

// genearate 404 not found error and pass it to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
})

// print stack tracetrace for development
if (!isProduction) {
    app.use(function (err, req, res, next) {
        console.log(err.stack);
        res.status(err.status || 500);
        res.json({ 'errors': { message: err.message, error: err } });
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({ 'errors': { message: err.message, error: {} } });
});

var server = app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log('Server listening on port ' + server.address().port);
});