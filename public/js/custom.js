$(document).ready(function(){

	var ht = $(window).height();

	$(".window").height(ht);

	$("window").on("resize", function() {
		var ht = $(window).height();
		$(".window").height(ht);
	});

	$("#gototop").on("click", function(e) {
		e.preventDefault();
		$("html,body").animate({"scrollTop":0}, 500);
	});
	
	$(".btnMenu").on("click", function() {
		$(".fix").fadeOut();
		$("nav").addClass("on");
		$(".box").addClass("on");
	});
	
	$("nav li").on("click", function() {
		$(".fix").fadeIn();
		$("nav").removeClass("on");
		$(".box").removeClass("on");
	});





	$(".window").on("mousewheel", function(event,delta) {
		if(delta>0) {
			var prev = $(this).prev().offset().top;
			$("html,body").stop().animate({"scrollTop":prev}, 500);
		}
		else if(delta<0) {
			var next = $(this).next().offset().top;
			$("html,body").stop().animate({"scrollTop":next}, 500);
		}
		});
	
});