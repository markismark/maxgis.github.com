function zhezhao_ScollPostion() {//滚动条位置
	var t, l, w, h;
	if(document.documentElement && document.documentElement.scrollTop) {
		t = document.documentElement.scrollTop;
		l = document.documentElement.scrollLeft;
		w = document.documentElement.scrollWidth;
		h = document.documentElement.scrollHeight;
	} else if(document.body) {
		t = document.body.scrollTop;
		l = document.body.scrollLeft;
		w = document.body.scrollWidth;
		h = document.body.scrollHeight;
	}
	return {
		top : t,
		left : l,
		width : w,
		height : h
	};
}

//整个页面的高宽
function zhezhao_getPageSize() {
	var body = (document.compatMode && document.compatMode.toLowerCase() == "css1compat") ? document.documentElement : document.body;
	var bodyOffsetWidth = 0;
	var bodyOffsetHeight = 0;
	var bodyScrollWidth = 0;
	var bodyScrollHeight = 0;
	var pageDimensions = [0, 0];
	pageDimensions[0] = body.clientHeight;
	pageDimensions[1] = body.clientWidth;
	bodyOffsetWidth = body.offsetWidth;
	bodyOffsetHeight = body.offsetHeight;
	bodyScrollWidth = body.scrollWidth;
	bodyScrollHeight = body.scrollHeight;
	if(bodyOffsetHeight > pageDimensions[0]) {
		pageDimensions[0] = bodyOffsetHeight;
	}

	if(bodyOffsetWidth > pageDimensions[1]) {
		pageDimensions[1] = bodyOffsetWidth;
	}

	if(bodyScrollHeight > pageDimensions[0]) {
		pageDimensions[0] = bodyScrollHeight;
	}

	if(bodyScrollWidth > pageDimensions[1]) {
		pageDimensions[1] = bodyScrollWidth;
	}
	return pageDimensions;
}

function zhezhao_getObjWh(w, h) {
	var ch = document.documentElement.clientHeight;
	var cw = document.documentElement.clientWidth;
	var objT = Math.max((Number(ch) - h) / 2, 0);
	var objL = Math.max((Number(cw) - w) / 2, 0);
	return {
		top : objT,
		left : objL
	};
}

;(function($) {
	$.fn.extend({
		zhezhao : function(options) {
			var defaults = {
				background : "#666",
				alpha : 0.7,
				zindex : 99,
				effect : "bianda",
				handle : "zhezhao",
				moveSelector : "",
				loadComplete : null,
				moveEnabled : true,
				model : true
			}
            if(jQuery.browser.msie===true){
                defaults.effect="fade";
            }
			options = $.extend({}, defaults, options || {});
			var ds = $("#" + options.id);
			if(ds.length == 0) {
				$("body").append("<div class='fullbgjssduf' id='" + options.id + "' style='display: none; left: 0px; top: 0px; width: 0px; height: 0px'></div");
			}
			ds = $("#" + options.id);
			var that = $(this);
			if($("#fullbg_" + options.id).length == 0) {
				var fullbg = "<div class='fullbgjssduf' id='fullbg_" + options.id + "' style='background-color:" + options.background + ";display: none;z-index: " + options.zindex + ";position: absolute;left: 0px;top: 0px;filter: Alpha(Opacity=" + (options.alpha * 100) + ");-moz-opacity: " + (options.alpha) + ";opacity: " + (options.alpha) + ";'></div>"
				$(document.body).append(fullbg);
			}
			var size = zhezhao_ScollPostion();
			$("#fullbg_" + options.id).css({
				width : size.width,
				height : size.height,
				display : "block"
			});
			ds.css("z-index", options.zindex + 2);
			ds.css("position", "fixed");
			var showTiplog = function() {
				that.resetBg(options, ds);
				var pos = {};
				pos = ds.offset();
				switch(options.effect) {
					case "zhendong":
						ds.zhendong(ds, options, pos);
						break;
					case "fade":
						ds.fade(ds, options, pos);
						break;
					case "bianda":
						ds.bianda(ds, options, pos);
						break;
					case "noeffect":
						ds.noeffect(ds, options, pos);
						break;
				}
				$(window).resize(function() {
					that.resetBg(options, ds);
				});
			}
			if(options.content) {
				ds.html(options.content);
				showTiplog();
				var fullresult = {};
				fullresult.options = options;
				return fullresult;
			}
			var loadPageing = function() {
				var load = "<div id='pageLoad' class='tippageload' style='position:absolute;z-index:" + (options.zindex + 1) + "></div>";
				$(document.body).append(load);
				var size = zhezhao_getObjWh(85, 81);
				$("#pageLoad").css({
					left : size.left,
					top : size.top
				});
			}
			var loaded = function() {
				$("#pageLoad").remove();
			}
			loadPageing();
			ds.load(options.url, function() {
				setTimeout(function() {
					$("div:first", ds).css({
						"box-shadow" : "0px 0px 12px #ded"
					});
					loaded();
					that.resetBg(options, ds);
					showTiplog();
					if( typeof (options.loadComplete) == "function") {
						options.loadComplete();
					};
					if(options.moveEnabled == true && options.moveSelector != "") {
						$(ds).moveInWindow(options.moveSelector);
					}

				}, 300)
			});
			var fullresult = {};
			fullresult.options = options;
			return fullresult;
		},
		moveInWindow : function(moveSelector) {
			$(moveSelector).css("cursor", "move");
			var _x = 0;
			var _y = 0;
			var ds = $(this);
			var _movIng = function(event) {
				ds.css({
					"left" : event.clientX - _x,
					"top" : event.clientY - _y
				});
			}
			$(moveSelector).bind("mousedown", function(event) {
				var _z = document.onmousedown;
				document.onmousedown = function() {
					return false;
				}
				_x = event.clientX - parseFloat(ds.css("left"));
				_y = event.clientY - parseFloat(ds.css("top"));
				$(document).bind("mousemove", _movIng);
				$(document).bind("mouseup", function() {
					document.onmousedown=_z;
					$(document).unbind("mousemove", _movIng);
				})
			})
		},
		closezz : function(options) {
			var fullbg = $("#fullbg_" + options.id);
			var ds = $("#" + options.id);
			ds.animate({
				left : 0,
				top : 0,
				width : 0,
				height : 0
			}, 500, function() {
				ds.hide();
				fullbg.remove();
				if(options != null && typeof (options.complete) != "undefined") {
					options.complete();
				}
			});
			return false;
		},
		zhendong : function(ds, options, pos) {
			for(var i = 3; i != 0; --i) {
				ds.animate({
					left : pos.left + 50,
					top : pos.top,
					width : options.width,
					height : options.height
				}, 20).animate({
					left : pos.left + 50,
					top : pos.top + 50
				}, 20).animate({
					left : pos.left,
					top : pos.top + 50
				}, 20).animate({
					left : pos.left,
					top : pos.top
				}, 20);
			}
		},
		fade : function(ds, options, pos) {
			ds.css({
				left : pos.left,
				top : pos.top,
				width : options.width,
				height : options.height,
				opacity : 0
			});
			ds.animate({
				opacity : 1
			});
		},
		bianda : function(ds, options, pos) {
			ds.css({
				left : pos.left,
				top : pos.top,
				width : 0,
				height : 0
			});
			ds.animate({
				left : pos.left,
				top : pos.top,
				width : options.width,
				height : options.height
			});
		},
		noeffect : function(ds, options, pos) {
			ds.css({
				left : pos.left,
				top : pos.top,
				width : options.width,
				height : options.height
			});
		},
		confirm : function(options) {
			var defaults = {
				background : "#666",
				alpha : 0.7,
				zindex : 200,
				content : "确定吗？",
				id : "confirm",
				width : 252,
				height : 140,
				effect : "bianda",
				ishei : true,
				cancel : true,
				sure : true,
				cancelcontent : "取消",
				surecontent : "确定",
				type : "warn",
				handle : "confirm"
			}
            if(jQuery.browser.msie===true){
                defaults.effect="fade";
            }
			var that = this;
			options = $.extend({}, defaults, options || {});
			var confirmBody = '<div id="confirm_TipContainer" style="z-index:' + (options.zindex + 2) + '" class="confirm_TipContainer"><div class="confirm_TipTitle"></div><div id="confirm_TipContent" class="confirm_TipContent"><table border="0" cellpadding="0"><tr valign="center"><td style="width: 15%"><div class="confirm_type confirm_type_' + options.type + '"</td><td style="width:80%">' + options.content + '</td></tr></table></div><div id="confirm_TipButton" class="confirm_TipButton">';

			if(options.sure) {
				confirmBody += '<input id="confirm_yes" type="button" value="' + options.surecontent + '">';
			}
			if(options.cancel) {
				confirmBody += '<input id="confirm_no" type="button" value="' + options.cancelcontent + '">'
			}
			//confirmBody+='<input id="confirm_yes" type="button" value="确定"><input id="confirm_no" type="button" value="取消"></div></div>';
			confirmBody += "</div></div>";
			$(document.body).append(confirmBody);
			if($("#fullbg_" + options.id).length == 0) {
				if(!options.ishei) {
					options.alpha = 0;
				}
				var fullbg = "<div id='fullbg_" + options.id + "' style='background-color:" + options.background + ";display: none;z-index: " + options.zindex + ";position: absolute;left: 0px;top: 0px;filter: Alpha(Opacity=" + (options.alpha * 100) + ");-moz-opacity: " + (options.alpha) + ";opacity: " + (options.alpha) + ";'></div>"
				$(document.body).append(fullbg);
			}
			var ds = $("#confirm_TipContainer");
			var size = zhezhao_ScollPostion();
			$("#fullbg_" + options.id).css({
				width : size.width,
				height : size.height,
				display : "block"
			});
			that.resetBg(options, ds);
			var pos = {};
			pos = ds.offset();
			var noeffect = function() {
				ds.css({
					left : pos.left,
					top : pos.top,
					width : options.width,
					height : options.height
				});
			}
			switch(options.effect) {
				case "zhendong":
					ds.zhendong(ds, options, pos);
					break;
				case "fade":
					ds.fade(ds, options, pos);
					break;
				case "bianda":
					ds.bianda(ds, options, pos);
					break;
				case "noeffect":
					ds.noeffect(ds, options, pos);

			}
			$("#confirm_yes").bind('click', function(event) {
				if(options.complete) {
					options.complete(true);
				}
				that.closeconfirm(options, ds, pos);
			});
			$("#confirm_no").bind('click', function(event) {
				if(options.complete) {
					options.complete(false);
				}
				that.closeconfirm(options, ds, pos);
			});

			$(window).resize(function() {
				that.resetBg(options, ds);
			});
			var fullresult = {};
			fullresult.options = options;
			return fullresult;
		},
		closeconfirm : function(options, ds, pos) {
			var close = function() {
				$("#confirm_TipContainer").remove();
				$("#fullbg_confirm").remove();
			}
			var zhendong = function() {
				for(var i = 3; i != 0; --i) {
					var x = function(i) {
						ds.animate({
							left : pos.left + 50,
							top : pos.top,
							width : options.width,
							height : options.height
						}, 20).animate({
							left : pos.left + 50,
							top : pos.top + 50
						}, 20).animate({
							left : pos.left,
							top : pos.top + 50
						}, 20).animate({
							left : pos.left,
							top : pos.top
						}, 20, function() {
							if(i == 1) {
								close();
							}
						});
					}
					x(i);
				}

			}
			var fade = function() {
				ds.animate({
					opacity : 0
				}, function() {
					close();
				});
			}
			var bianda = function() {
				ds.animate({
					left : pos.left + options.width / 2,
					top : pos.top + options.height / 2,
					width : 0,
					height : 0
				}, function() {
					close();
				});
			}
			var noeffect = function() {
				close();
			}
			switch(options.effect) {
				case "zhendong":
					zhendong();
					break;
				case "fade":
					fade();
					break;
				case "bianda":
					bianda();
					break;
				case "noeffect":
					noeffect();
			}

		},
		resetBg : function(options, ds) {
			var fullbg = $("#fullbg_" + options.id).css("display");
			if(fullbg == "block" || options.model == false) {
				var size = zhezhao_getPageSize();
				$("#fullbg_" + options.id).css({
					width : size[1],
					height : size[0]
				});
				var objV = zhezhao_getObjWh(options.width, options.height);

				ds.css({
					top : objV.top,
					left : objV.left,
					display : "block"
				});
			}
		}
	});
})(jQuery);
