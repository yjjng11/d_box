var express = require('express');
var router = express.Router();
var User = require('../models/User')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', function(req, res){
		addUser(req.body.id, req.body.password, function(err, result){
		if(err){throw err;}
		if(result){
			console.dir(result);
			res.render('login');
		}else{
			res.render('index');
		}
	})
});

router.get('/register', function(req, res){

	res.render('index');
});

router.post('/login',function(req, res){
	
	authUser(req.body.id, req.body.password, function(err, docs){
		if(err){throw err;}
		if(docs){
			console.dir(docs);
			res.render('reserve');
		}else{
			res.render('login');
		}
	});
	
});

var addUser = function(id, password, callback){
	var user = new User({"id": id, "password": password});

	user.save(function(err){
		if(err){
			callback(err, null);
		}
		console.log('사용자 데이터 추가함.');
		callback(null, user);
	});
}

var authUser = function(id, password, callback){
	User.findById(id, function(err, results){
		if(err){
			callback(err, null);
			return;
		}
		console.log('아이디 [%s]로 사용자 검색 결과', id);
		console.dir(results);

		if(results.length>0){
			console.log('아이디와 일치하는 사용자 찾음');

			var user = new User({id : id});
			var authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);

			if(authenticated){
				console.log('비밀번호 일치함');
				callback(null, results);
			}else{
				console.log('비밀번호 일치하지 않음');
				callback(null, null);
			}
		}

	});
}

module.exports = router;
