//switch to determine whether to use the static version of the page or the animated one
var isStatic = isStatic || false
// switch to determine whether to show the default hero image or not
var isHeroDefault = isHeroDefault || false

var slider = {}, tabs = {}, lead = {};

var controller = {}, quotebar_scene = {}, problem_scene = {}, smoke_scene = {}, shield_scene = {};

function isTouchDevice() {
	return 'ontouchstart' in window // works on most browsers
			|| navigator.maxTouchPoints; // works on IE10/11 and Surface
};

function isMobile() {
	return ($(window).width() < 601)
}

$(document).ready(function() {
	$('#mask').css('width: 100% !important;')
	$('#mask').css('margin-left: 10%;')
	$('#mask').css('margin-right: 0;')
	$('#mask').css('max-width: 90%;')

	if (isMobile() || isStatic) {
		controller = {}
		quotebar_scene = {}
		problem_scene = {}
		smoke_scene = {}
		shield_scene = {}
		$('#anim #poc-problem-solution').addClass('static')
	} else {
		$('#anim #poc-problem-solution').removeClass('static')
		controller = new ScrollMagic.Controller();
		quotebar_scene = new ScrollMagic.Scene({
			triggerElement : "#decoy",
			duration : 1,
			triggerHook : "onLeave"
		}).on("leave", function() {
			$('.scroll-cta').addClass('hidden');
		}).on("enter", function() {
			$('.scroll-cta').removeClass('hidden');
		}).addTo(controller);

		// problem-solution scene
		problem_scene = new ScrollMagic.Scene({
			triggerElement : "#poc-problem-solution",
			duration : "1000",
			triggerHook : "onLeave"
		}).on("enter", function() {
			$('#poc-problem-graphic').addClass('pin');
		}).on("leave", function() {
			$('#poc-problem-graphic').removeClass('pin');
		}).setPin("#poc-problem-graphic").addTo(controller);

		// smoke
		smoke_scene = new ScrollMagic.Scene({
			triggerElement : "#poc-problem-solution",
			duration : "1200",
			offset : 0
		}).on("enter", function() {
			$('#smoke').addClass('visible');
		}).on("leave", function() {
			$('#smoke').removeClass('visible');
		}).addTo(controller);

		// smoke
		shield_scene = new ScrollMagic.Scene({
			triggerElement : "#poc-solution",
			offset : 200
		}).on("enter", function() {
			$('#shield,#contractor').addClass('visible');
		}).on("leave", function() {
			$('#shield,#contractor').removeClass('visible');
		}).addTo(controller);
	}

	// renderSections()

	if (!isTouchDevice()) {
		$('#howItWorks .slider').slider({
			interval : 10000000000,
			indicators : false
		})
		slider.el = $('#howItWorks .slider')
		slider.nextBtn = $('#howItWorks .next .btn-circle')
		slider.stepNext = $('#howItWorks .next .step')
		slider.stepPrev = $('#howItWorks .prev .step')
		slider.prevBtn = $('#howItWorks .prev .btn-circle')
		slider.vLine = $('#howItWorks > .v-line')
	} else {
		$('#howItWorks .slider').slider({
			interval : 10000000000,
			indicators : true
		})
		$('#howItWorks .next, #howItWorks .prev').addClass('hidden')
		$('#howItWorks .v-line').first().addClass('hidden')
	}
	$('#howItWorks .slider').slider('pause')

	resizeVideo()

	$('#blog .slider').slider({
		interval : 10000000000,
		indicators : false
	})
	$('#blog .slider').slider('pause')

	tabs.ul = $("#realty .tabs")
	tabs.length = tabs.ul.children('.tab').length
	tabs.nextBtn = $("#realty .next .btn-circle")
	tabs.prevBtn = $("#realty .prev .btn-circle")
	tabs.ul.tabs({
		onShow : tabs.onShow
	})

	lead.mask = $('#hero #mask')
	lead.form = $('#hero #quoteForm')
	lead.contentLeft = $('#hero #content-left')
});

slider.next = function() {
	if (this.el.find('.active').index() === 3)
		return

	this.el.slider('next')
	this.el.slider('pause')
	if (this.el.find('.active').index() === 3)
		this.nextBtn.addClass('hidden')
	else
		this.prevBtn.removeClass('hidden')
	this.stepNext.text(this.el.find('.active').index() < 3 ? 'Step ' + (this.el.find('.active').index() + 2) : '')
	this.stepPrev.text('Step ' + this.el.find('.active').index())
	this.vLineFn()
}
slider.prev = function() {
	if (this.el.find('.active').index() === 0)
		return

	this.el.slider('prev')
	this.el.slider('pause')
	if (this.el.find('.active').index() === 0)
		this.prevBtn.addClass('hidden')
	else
		this.nextBtn.removeClass('hidden')
	this.stepNext.text('Step ' + (this.el.find('.active').index() + 2))
	this.stepPrev.text(this.el.find('.active').index() > 0 ? 'Step ' + this.el.find('.active').index() : '')
	this.vLineFn()
}
slider.vLineFn = function() {
	if (this.el.find('.active').index() === 0)
		this.vLine.removeClass('white-border')
	else
		this.vLine.addClass('white-border')
}

tabs.prev = function() {
	var index = parseInt(this.ul.children().has('.active').children().attr('data-i'))
	if (index <= 0)
		return

	if (index === 0)
		this.prevBtn.addClass('hidden')
	else if (index === this.length - 1)
		this.nextBtn.addClass('hidden')
	index = (index - 1).toString()
	this.ul.children().children('[data-i=' + index + ']').click()
}
tabs.next = function() {
	var index = parseInt(this.ul.children().has('.active').children().attr('data-i'))
	if (index >= this.length - 1)
		return

	if (index === 1)
		this.prevBtn.removeClass('hidden')
	else if (index === this.length - 1)
		this.nextBtn.addClass('hidden')
	index = (index + 1).toString()
	this.ul.children().children('[data-i=' + index + ']').click()
}
tabs.onShow = function() {
	var index = parseInt(tabs.ul.children().has('.active').children().attr('data-i'))
	if (index === 0)
		tabs.prevBtn.addClass('hidden')
	else if (index === 1)
		tabs.prevBtn.removeClass('hidden')

	if (index === tabs.length - 2)
		tabs.nextBtn.removeClass('hidden')
	else if (index === tabs.length - 1)
		tabs.nextBtn.addClass('hidden')
}

function onWindowResize() {
	window.addEventListener("resize", resizeThrottler, false);

	var resizeTimeout;
	function resizeThrottler() {
		if (!resizeTimeout) {
			resizeTimeout = setTimeout(function() {
				resizeTimeout = null;
				actualResizeHandler();
			}, 200);
		}
	}

	function actualResizeHandler() {
		// the animation won't hold its place on resize
		renderSections()
		resizeVideo()
		if (isMobile())
			carouselInit()
	}
}
onWindowResize()

resizeVideo = function() {
	var width = $('.video').width() || 0;
	if (!width)
		return

	

	var height = width / 1.77006880733945 // aspect ratio
	$('.video').height(height)
}

function carouselInit() {
	var carousel = $('#plans .carousel')
	if (carousel.length) {
		carousel.removeClass('initialized')
		$('#plans .carousel').carousel({
			padding : -100
		});
	}
}

lead.show = function() {
	this.contentLeft.addClass('hidden')
	this.form.addClass('show')
}

lead.hide = function() {
	if (!this.form.hasClass('show'))
		return

	this.contentLeft.removeClass('hidden')
	this.form.removeClass('show')
}

function getCookieVal(search) {
	var split = document.cookie.split(';'), val = '';
	for (var i = 0; i < split.length; i++) {
		if (split[i].indexOf(search) > -1) {
			split = split[i].split('=')
			val = split[1]
		}
	}
	return val
}
