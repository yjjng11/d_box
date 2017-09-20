var mongoose = require("mongoose");
var User = require('../models/User')

var BoxSchema = mongoose.Schema({
	box_id : {type : Number, unique : true, 'default' : 0}
	, user_id : {type : String, ref : 'User', 'default' : '-'}
	, led_out : {type : Number, 'default' : 0 }
	, led_in : {type : Number, 'default' : 0}
	, photosen : {type : Number, 'default' : 0}
	, micros : {type : Number, 'default' : 0}
	, lock : {type : Number, 'default' : 0}
	, using : {type : Number, 'default' : 0}
});


var Boxes = mongoose.model("boxes",BoxSchema);
module.exports= Boxes;