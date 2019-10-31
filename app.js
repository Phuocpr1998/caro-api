var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const passport = require('passport');
const fileUpload = require('express-fileupload');
require('./routes/user/passport');

const userRouter = require('./routes/user/user');
var indexRouter = require('./routes/index');
var meRouter = require('./routes/user/me');

var app = express();

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(fileUpload({
  createParentPath: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(allowCrossDomain);

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/me', passport.authenticate('jwt', {session: false}), meRouter);

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
  console.log(err);
  res.send('error');
});

var server = require('http').createServer(app);
var io = require('socket.io')(server);
require('./socket/socketserver')(io)

server.listen(process.env.PORT || 9000, function(){
  console.log('server listening...');
});
