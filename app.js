var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// config mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://trminhthi98:0i55Od8CWXbcJnbn@mycluster01.mj61fgr.mongodb.net/asm')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
require('./models/user');
require('./models/timekeeping');
require('./models/department');
 require('./models/leave');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var leaveRouter = require('./routes/leave');
var timekeepingRouter = require('./routes/timekeepings');
var departmentRouter = require('./routes/department');


var app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-config.js');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/leaves', leaveRouter);
app.use('/timekeepings', timekeepingRouter);
app.use('/departments', departmentRouter);

// models


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
