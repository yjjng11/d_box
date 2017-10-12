var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');
var base64 = require('node-base64-image');

var Boxes = require('./models/Boxes');

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');

var app = express();

var UserSchema;
var UserModel;

mongoose.connect('mongodb://localhost:27017/dbox');
var database=mongoose.connection;
database.on('error',console.error.bind(console,'connection error:'));
database.once('open',function(){
  console.log("DB connected");
});

var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(3000, function(){
	console.log('Socket io server listening on port 3000');
})

io.on('connect', function(socket){
	var first_data = -1;
	var second_data = -1;
	console.log('client :'+socket.id);
	socket.on('sensor', function(data){
		console.log('micros:' + data.micros+' ledout:'+data.ledout);
	});

	socket.on('lock', function(data){
		console.log('브라우저 '+ socket.id +" "+ data.lock);
		socket.broadcast.emit('rasp_lock', data);
	});

	socket.on('rasp_response', function(data){
		if(data.lock == 0){
			Boxes.findOneAndUpdate({ _id: data.id },  { lock: 0 } , function(err, box) {
			if (err) throw err;
				});
		} else {
			Boxes.findOneAndUpdate({ _id: data.id },  { lock: 1 } , function(err, box) {
			if (err) throw err;
				});
		}
		console.log('raspberry ' + socket.id+" "+data.lock);
		socket.broadcast.emit('lock', data);
	});

	socket.on('photo', function(data){
		console.log('client to server')
		socket.broadcast.emit('rasp_photo', data);
	});

	socket.on('photo_res',function(data){
		
		base64.decode(data.image,{filename:'pictures/'+data.user_id+'_'+data.box_id},function(err,x){
			if(err) throw err;
			console.log(x);
			socket.broadcast.emit('img_attach',data);
		});
	});


	socket.on('upload',function(data){

		console.log(data);

		Boxes.findOneAndUpdate({ box_id: data.box_id },  { lock: data.lock, photosen: data.photosen, micros:data.micros } , function(err, box) {
			if (err) throw err;
				});

	});
});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'pictures')));

app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));

app.use('/', index);
app.use('/users', users);
app.use('/admin',admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

/*http.listen(3000, function(){
    console.log("Express server listening on port 3000 ");
});

io.on('connect', function(socket){
     
    console.log('a user connected');
     
    socket.broadcast.emit('hi');
     
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
     
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    }); 
 
});*/


/*app.listen(3000,function(){
  console.log("server on!");
});*/

module.exports = app;
