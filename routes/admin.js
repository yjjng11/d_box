var express = require('express');
var router = express.Router();
var User = require('../models/User')
var Boxes = require('../models/Boxes')

/* GET home page. */
router.get('/', function(req, res, next) {
	Boxes.find({})
  	.exec(function(err, boxes){
    if(err) return res.json(err);
    res.render("admin", {boxes:boxes});
 	 });
});

//update
router.get('/:id', function(req, res){
	Boxes.update({_id:req.params.id}, {$set: {lock : 1}}, function(err, result){
		if(err) return res.json(err);
	});
	
});

module.exports = router;