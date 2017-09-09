var mongoose = require("mongoose");
var crypto = require('crypto');

var UserSchema = mongoose.Schema({
	id : {type : String, 'default' : ''}
	, hashed_password : {type : String, required : true, 'default' : ''}
	//, name : {type : String, index : 'hashed', 'default' : ''}
	, salt : {type : String, required: true}
	//, created_at : {type : Date, index : {unique : false}, 'default' : Date.now}
});

UserSchema
	.virtual('password')
	.set(function(password){
		this._password = password;
		this.salt = this.makeSalt();
		this.hashed_password = this.encryptPassword(password);
		console.log('virtual password 호출됨. : '+this.hashed_password);

	})
	.get(function(){return this._password});

//스키마에 모델 인스턴스에서 사용할 수 있는 메소드 추가
// 비밀번호 암호화 메소드
UserSchema.method('encryptPassword', function(plainText, inSalt){
	if(inSalt){
		return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');

	}else{
		return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
	}
});

//salt 값 만들기 메소드
UserSchema.method('makeSalt', function(){
	return Math.round((new Date().valueOf() * Math.random())) + '';
});

//인증 메소드 - 입력된 비밀번호와 비교 (true/false 리턴)
UserSchema.method('authenticate', function(plainText, inSalt, hashed_password){
	if(inSalt){
		console.log('authenticate 호출됨. : %s -> %s : %s',plainText, this.encryptPassword(plainText,inSalt), hashed_password);
		return this.encryptPassword(plainText, inSalt) == hashed_password;
	} else{
		console.log('authenticate 호출됨. : %s -> %s : %s',plainText, this.encryptPassword(plainText), this.hashed_password)
		return this.encryptPassword(plainText) == this.hashed_password;
	}
});

//필수 속성에 대한 유효성 확인
UserSchema.path('id').validate(function(id){
	return id.length;
}, 'id의 값이 없습니다.');

UserSchema.path('hashed_password').validate(function(hashed_password){
	return hashed_password.length;
}, 'hashed_password의 값이 없습니다.');

UserSchema.static('findById', function(id, callback){
	return this.find({id : id}, callback);
});

/*
UserSchema.path('email').validate(function(email){
	return email.length;
}, 'email의 값이 없습니다.');





UserSchema.static('findAll', function(callback){
	return this.find({}, callback);
});
*/
var User = mongoose.model("user",UserSchema);
module.exports=User;