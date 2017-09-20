var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Boxes = require('../models/Boxes');
var UsageInfo = require('../models/UsageInfo');

/* GET home page. */
router.get('/', function(req, res, next) {
	Boxes.find({})
  	.exec(function(err, boxes){
    if(err) return res.json(err);

    UsageInfo.find({})
      .exec(function(err, info){
        if(err) return res.json(err);
        res.render("admin", {boxes:boxes, info:info});
      });

 	 });
});

router.get('/:id', function(req, res){
	Boxes.findOne({_id:req.params.id}, function(err, box){
    if(err) return res.json(err);
    res.render("eachbox", {box:box});
  });
	
});

router.post('/', function(req, res){
	var lock = req.body.lock;
	var id = req.body.id;

	if(lock == 1){
		Boxes.findOneAndUpdate({ _id: id },  { lock: 0 } , function(err, box) {
    	if (err) throw err;
   	 	res.send({lock:0});
  		});
	} else {
		Boxes.findOneAndUpdate({ _id: id },  { lock: 1 } , function(err, box) {
    	if (err) throw err;
   	 	res.send({lock:1});
  		});
	}
	
  	//res.redirect(303,"/admin/"+id);

});

module.exports = router;