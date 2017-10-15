var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Boxes = require('../models/Boxes');
var UsageInfo = require('../models/UsageInfo');
var PastInfo = require('../models/PastInfo');
require('date-utils');

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.session.user_id == null)
	res.render('login');
	else{
		Boxes.find({})
		.exec(function(err, boxes){
	  	if(err) return res.json(err);
	 	res.render("reserve", {boxes:boxes});
	 	});
	}
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
	});
});

router.get('/mybox', function(req, res){
	
	if(req.session.user_id == null)
		res.render('login');
	else{
		Boxes.find({user_id:req.session.user_id})
  		.exec(function(err, boxes){
    	if(err) return res.json(err);
    	res.render("mybox", {boxes:boxes});
		  });
	}
	
});

router.post('/delete_info', function(req, res){

	var _id = req.body._id;
	UsageInfo.findOne({_id:_id}, function(err, info){
		if(err) throw err;
		var info_instance = info;
		console.log(info_instance.user_id);
		PastInfo.create({box_id: info.box_id, user_id: info.user_id, start_date: info.start_date, finish_date: info.finish_date, price: info.price}, function(err, info){
			if(err) throw err;
			  });
		Boxes.findOneAndUpdate({ user_id: info_instance.user_id },  { using: 0, user_id:'-' } , function(err, box) {
			if (err) throw err;
			UsageInfo.findByIdAndRemove(_id, function(err, user){
				if(err) throw err;
				res.send({result:'success'});
			});
		  });
		  
	});

	
});

router.get('/reserve', function(req, res){

	if(req.session.user_id == null)
	res.render('login');
	else{
	Boxes.find({})
  			.exec(function(err, boxes){
    		if(err) return res.json(err);
    		res.render("reserve", {boxes:boxes});
			});
	}
});

router.get('/register', function(req, res){

	res.render('index');
});

router.post('/login',function(req, res){
	
	authUser(req.body.id, req.body.password, function(err, docs){
		if(err){throw err;}
		if(docs){
			console.dir(docs);
			req.session.user_id = req.body.id;
			Boxes.find({})
  			.exec(function(err, boxes){
    		if(err) return res.json(err);
    		res.render("reserve", {boxes:boxes});
 	 		});
		}else{
			res.render('login');
		}
	});
	
});

router.post('/reserve', function(req, res){

	var box_id = req.body.box;
	var user_id = req.session.user_id;
	var f_dt = new Date(req.body.finish_date);
	var finish_date = f_dt.toFormat('YYYY-MM-DD');
	var s_dt = new Date();
	var start_date = s_dt.toFormat('YYYY-MM-DD HH24:MI:SS');
	var day = s_dt.getDaysBetween(f_dt);
	var price = (day+1) * 2000;

	if(req.session == 'undefined')
		res.render('login');

	UsageInfo.create({box_id: box_id, user_id: user_id, start_date: start_date, finish_date:finish_date, price:price}, function(err, info){
    if(err) return res.json(err);
  	});

    Boxes.findOneAndUpdate({ box_id: box_id },  { user_id: user_id, using: 1, } , function(err, box) {
    	if (err) throw err;
   	 	res.render('complete',{box_id:box_id});
  	});

});

router.get('/logout', function(req, res){
	console.log(req.session);
	req.session.destroy(function(err){ 
		res.clearCookie('sid'); // 세션 쿠키 삭제
		console.log(req.session);
		res.render('login');
	});
  	
  	
});

var addUser = function(id, password,  callback){
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
