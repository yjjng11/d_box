var mongoose = require("mongoose");
var User = require('../models/User');
var Boxes = require('../models/Boxes');

var PastSchema = mongoose.Schema({
	box_id : {type : Number, ref : 'Boxes', 'default' : 0}
	, user_id : {type : String, ref : 'User', 'default' : '-'}
	, start_date : {type : Date }
	, finish_date : {type : Date }
	, price : {type : Number, 'default' : 0}
});

var PastInfo = mongoose.model("pastinfo",PastSchema);
module.exports= PastInfo;