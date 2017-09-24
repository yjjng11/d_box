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
});


/*
function connectDB(){
	var databaseUrl = 'mongodb://localhost:27017/dbox';

	mongoose.connect(databaseUrl);
	database = mongoose.connection;

	database.on('error', console.error.bind(console, 'mongoose connection error.'));
	database.on('open', function(){
		console.log('데이터베이스에 연결되었습니다. : ', + databaseUrl);

		UserSchema = mongoose.Schema({
			id : {type : String, required: true, unique: true},
			password : {type: String, required: true},
			name : {type: String, index: 'hashed'},
			age: {type: Number, 'default': -1},
			created_at: {type: Date, index: {unique: false}, 'default': Date.now},
			updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
		});

		UserSchema.static('findById', function(id, callback){
			return this.find({id: id}, callback);
		});

		UserSchema.static('findAll', function(callback){
			return this.find({}, callback);
		});
		console.log('UserSchema 정의함.');

		UserModel = mongoose.model("user", UserSchema);

	});
	database.on('disconnected', connectDB);
}

var authUser = function(database, id, password, callback){
	console.log('authUser 호출됨.');

	UserModel.findById(id, function(err, results){
		if(err){
			callback(err, null);
			return;
		}

		console.log('아이디 [%s]로 사용자 검색 결과', id, password);
		console.dir(results);

		if(results.length > 0){
			console.log('일치하는 사용자 찾음.',id);

			if(results[0]._doc.password == password){
				console.log('비밀번호 일치함');
				callback(null, results);
			}else{
				console.lgo('비밀번호 일치하지 않음');
				callback(null, null);
			}
			
		} else {
			console.log('아이디와 일치하는 사용자 찾지 못함.');
			callback(null, null);
		}
	});
};

var addUser = function(database, id, password, name, callback){
	console.log ('addUser 호출됨.');

	var user = new UserModel({"id": id, "password": password, "name": name});

	user.save(function(err){
		if(err){
			callback(err, null);
			return;
		}
		console.log('사용자 데이터 추가함.');
		callback(null, user);
	});
};

app.post('/process/adduser', function(req, res){
	console.log('/process/adduser 호출됨.');

	var paramId = req.param('id');
	var paramPassword = req.param('password');
	var paramName = req.param('name');

	if(database){
		addUser(database, paramId, paramPassword, paramName, function(err, result){
			if(err){throw err;}

			if(result){
				console.dir(result);

				res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
				res.write('<h2>사용자 추가 성공</h2>');
				res.end();
			}else{
				res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
				res.write('<h2>사용자 추가 실패</h2>');
				res.end();
			}
		});
	}else{
		res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>')
		res.end();
	}
});
*/

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

app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));

/*
//passport 사용 설정
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//사용자 인증에 성공했을 때 호출
passport.serializeUser(function(user, done){
	console.log('serializeUser() 호출됨.');
	console.dir(user);

	done(null, user);
})

//사용자 인증 이후 사용자 요청이 있을 때마다 호출
passport.deserializeUser(function(user, done){
	console.log('deserializeUser() 호출됨.');
	console.dir(user);

	done(null, user);
})
*/
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
