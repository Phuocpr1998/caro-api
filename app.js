var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');
const passport = require('passport');

require('./routes/user/passport');

const userRouter = require('./routes/user/user');
var indexRouter = require('./routes/index');
var meRouter = require('./routes/user/me');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({origin:true,credentials: true}));

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

server.listen(process.env.PORT || 3000, function(){
  console.log('server listening...');
});
