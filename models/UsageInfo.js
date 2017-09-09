var mongoose = require("mongoose");
var User = require('../models/User');
var Boxes = require('../models/Boxes');

var UsageSchema = mongoose.Schema({
	box_id : {type : Number, ref : 'Boxes', 'default' : 0}
	, user_id : {type : String, ref : 'User', 'default' : '-'}
	, start_date : {type : Date }
	, finish_date : {type : Date }
	, price : {type : Number, 'default' : 0}
});

var UsageInfo = mongoose.model("usageinfo",UsageSchema);
module.exports= UsageInfo;