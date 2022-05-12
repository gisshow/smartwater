/**********等待条内容************/
/** 显示与隐藏等待框 */
WaitBar = function() {
	var bCreate = false;
	var initDiv = 'if(false == bCreate){document.body.appendChild(pDiv);bCreate = true;}';
	var pDiv = document.createElement("DIV");
	pDiv.className = 'bar_div';
	pDiv.innerHTML = '<div class=bar_icons></div>';
	pDiv.innerHTML += '<div class=bar_font>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请稍等...</div>';
	// 进度与下载
	pDiv.style.width = "230px";
	pDiv.style.zIndex = 100001;
	var pgDiv = document.createElement("DIV");
	pDiv.appendChild(pgDiv);
	var pgA = document.createElement("A");
	var pgUrl = document.createElement("span");
	pgDiv.appendChild(pgA);
	pgDiv.appendChild(pgUrl);

	// WaitBar个数，show()自增，hide()自减。个数为0时隐藏WaitBar
	var waitBarCount = 0;// if(flg!=2){waitBarCount++;}
							// if(flg!=2){waitBarCount--;}if(waitBarCount >
							// 0){return;}

	return {
		showOrhide : function() {
			var mask = $(".bar_icons");
			pDiv.style.display = 'block';
			if (mask.length > 0) {
				this.hide();
			} else {
				this.show();
			}
		},
		// waitBarCount : 0,
		show : function(flg) {
			if (flg != 2) {
				waitBarCount++;
			}
			eval(initDiv);
			pDiv.style.display = 'block';
			if (flg) {
				WaitBar.showModal();
			}
		},// 显示等待框
		hide : function(flg) {
			if (flg != 2) {
				waitBarCount--;
			}
			// 如果waitBarCount为负数，则复位
			if (waitBarCount < 0) {
				waitBarCount = 0;
			}
			if (waitBarCount > 0) {
				return;
			}

			eval(initDiv);
			if (flg == 2) {
				pDiv.style.display = 'none';
				WaitBar.hideModal();
			} else {
				setTimeout(function() {
					if (waitBarCount > 0) {
						return;
					}
					pDiv.style.display = 'none';
					WaitBar.hideModal();
				}, 500);
			}
		},// 隐藏等待框
		hideProgress : function() {
			pgDiv.style.display = 'none';
			pDiv.style.background = 'transparent';
		},// 隐藏进度
		setProgress : function(progress, url) {// 设置进度与下载a标签
			pDiv.style.display = 'block';// 为避免中途因其它后台操作，而导致等待条被隐藏
			pgA.innerHTML = '&nbsp;&nbsp;进度：<font color="green">' + progress
					+ '%</font>&nbsp;';
			pgDiv.style.display = 'block';
			if (url) {
				pgUrl.innerHTML = '，请<a href="'
						+ url
						+ '" onclick="WaitBar.hideProgress();WaitBar.hide();"><font style="font-weight: bold;color:red">点击这里</font></a>下载文件';
			} else if (progress == "99") {
				pgUrl.innerHTML = '，文件打包中...';
			}
		},
		setMsg : function(progress) {// 设置进度与下载a标签
			pDiv.style.display = 'block';// 为避免中途因其它后台操作，而导致等待条被隐藏
			pgDiv.innerHTML = progress;
			pDiv.style.background = 'white';
			with (pgDiv.style) {
				display = 'block';
				background = 'white';
				paddingLeft = '10px';
			}
			/*
			 * with(document.getElementById("EXPORT_MODAL_DIV").style){
			 * display="block"; width=document.body.clientWidth;
			 * height=document.body.clientHeight; }
			 */
			WaitBar.showModal();
		},
		showModal : function() {// 设置遮罩
			var div = document.getElementById("EXPORT_MODAL_DIV");
			if (!div) {
				div = document.createElement("div");
				div.id = "EXPORT_MODAL_DIV";
				document.body.appendChild(div);
				with (div.style) {
					width = document.body.clientWidth;
					height = document.body.clientHeight;
					position = "absolute";
					left = "0px";
					top = "0px";
					zIndex = 100000;
					backgroundColor = "black";
					filter = "alpha(opacity=" + 1 + ");";
					opacity = 0.01;
				}
			}
			div.style.display = "block";
		},
		hideModal : function() {// 隐藏遮罩
			if (document.getElementById("EXPORT_MODAL_DIV")) {
				document.getElementById("EXPORT_MODAL_DIV").style.display = "none";
			}
		},
		isExporting : function() {
			return (pDiv.style.display == 'block'
					&& pgDiv.style.display == 'block' && pgDiv.innerText
					.indexOf("100%") < 0);
		},
		setStyle : function(styleJson) {
			if (styleJson.top != undefined) {
				pDiv.style.top = styleJson.top;
			}
		}
	}
}();
// ***********************系统级方法**************************//
var ARRAY_DESTROY = new Array(); // 存储销毁方法的数组
var sys = {
	DESTROY_ADD : function(value) {
		var listVal = value.split(',');
		for (var i = 0; i < listVal.length; i++) {
			ARRAY_DESTROY.push(listVal[i]);
		}
	},
	DESTROY_EXE : function() {
		if (ARRAY_DESTROY != null) {
			if (ARRAY_DESTROY.length > 0) {
				for (var i = 0; i < ARRAY_DESTROY.length; i++) {
					try {
						eval(ARRAY_DESTROY[i] + "=null;");
						ARRAY_DESTROY.splice(i);
					} catch (e) {
						Logger.log("销毁方法执行失败:" + ARRAY_DESTROY[i]);
					}
				}
			}
		}
	}
}
// ***********************开窗一条龙**************************//
var win = {
	winopenMax : function(url) {
		var sLeft = 0;
		var sTop = 0;
		var sW = parseInt(screen.availWidth) - 6;
		var sH = parseInt(screen.availHeight) - 50;
		var option = "height="
				+ sH
				+ ",width="
				+ sW
				+ ",left="
				+ sLeft
				+ ",top="
				+ sTop
				+ ",scrollbars=yes,status=yes,toolbar=yes,menubar=no,location=yes,resizable=yes";
		var newWin = window.open(url, "", option);
		newWin.focus();
	},
	winopen80 : function(url) {
		var sW = parseInt(screen.availWidth * 0.8) - 6;
		var sH = parseInt(screen.availHeight * 0.8) - 50;
		var sLeft = (screen.width - sW) / 2;
		var sTop = (screen.height - sH) / 2;
		var option = "height="
				+ sH
				+ ",width="
				+ sW
				+ ",left="
				+ sLeft
				+ ",top="
				+ sTop
				+ ",scrollbars=yes,status=yes,toolbar=no,menubar=no,location=no,resizable=yes";
		var newWin = window.open(url, "", option);
		newWin.focus();
	},
	winopen50 : function(url) {
		var sW = parseInt(screen.availWidth * 0.5) - 6;
		var sH = parseInt(screen.availHeight * 0.5) - 50;
		var sLeft = (screen.width - sW) / 2;
		var sTop = (screen.height - sH) / 2;
		var option = "height="
				+ sH
				+ ",width="
				+ sW
				+ ",left="
				+ sLeft
				+ ",top="
				+ sTop
				+ ",scrollbars=yes,status=yes,toolbar=no,menubar=no,location=no,resizable=yes";
		var newWin = window.open(url, "", option);
		newWin.focus();
	},
	winopenRight : function(url) {
		var sW = parseInt(screen.availWidth * 0.5) - 6;
		var sH = parseInt(screen.availHeight) - 50;
		var sLeft = (screen.width - sW);
		var sTop = 0;
		var option = "height="
				+ sH
				+ ",width="
				+ sW
				+ ",left="
				+ sLeft
				+ ",top="
				+ sTop
				+ ",scrollbars=yes,status=yes,toolbar=no,menubar=no,location=no,resizable=yes";
		var newWin = window.open(url, "", option);
		newWin.focus();
	},
	CloseWindow : function() {
		var ua = navigator.userAgent;
		var ie = navigator.appName == "Microsoft Internet Explorer" ? true
				: false;
		if (ie) {
			var IEversion = parseFloat(ua.substring(ua.indexOf("MSIE ") + 5, ua
					.indexOf(";", ua.indexOf("MSIE "))))
			if (IEversion < 5.5) {
				var str = '<object id=noTipClose classid="clsid:ADB880A6-D8FF-11CF-9377-00AA003B7A11">'
				str += '<param name="Command" value="Close"></object>';
				document.body.insertAdjacentHTML("beforeEnd", str);
				document.all.noTipClose.Click();
			} else {
				window.opener = null;
				window.close();
			}
		} else
			window.close();
	},
	winopenNormal : function(url, winNM, sW, sH) {
		var sLeft = (screen.width - sW) / 2;
		var sTop = (screen.height - sH) / 2;
		if (sW == 0 || sW == "") {
			sLeft = 0;
			sW = parseInt(screen.availWidth) - 6;
		}
		if (sH == 0 || sH == "") {
			sTop = 0;
			sH = parseInt(screen.availHeight) - 50;
		}
		var option = "dialogHeight:" + sH + "px;dialogWidth:" + sW
				+ "px;center:yes;status:off;help:no;scroll:off;resizable=yes";
		var newWin = null;
		var explorer = window.navigator.userAgent;
		if (explorer.indexOf("Chrome") < 0) {
			newWin = window.showModalDialog(url, winNM, option);
		} else {
			option = "height="
					+ sH
					+ ",width="
					+ sW
					+ ",left="
					+ sLeft
					+ ",top="
					+ sTop
					+ ",scrollbars=yes,status=yes,toolbar=no,menubar=no,location=no,resizable=yes";
			newWin = window.open(url, winNM, option);
		}
		if (newWin == null) {
			newWin = window.returnValue;
		}
		return newWin;
	},
	confirmx : function(mess, callback, closed) {
		layer.confirm(mess, {
			icon : 3,
			title : '系统提示'
		}, function(index) {
			// 确认对话框
			if (typeof callback == 'function') {
				callback();
			} else {
				location = href;
			}
			layer.close(index);
		});
		return false;
	},
	promptx : function(title, lable, href, closed) {
		top.$.jBox(
				"<div class='form-search' style='padding:20px;text-align:center;'>"
						+ lable
						+ "：<input type='text' id='txt' name='txt'/></div>", {
					title : title,
					submit : function(v, h, f) {
						if (f.txt == '') {
							top.$.jBox.tip("请输入" + lable + "。", 'error');
							return false;
						}
						if (typeof href == 'function') {
							href();
						} else {
							resetTip(); // loading();
							location = href + encodeURIComponent(f.txt);
						}
					},
					closed : function() {
						if (typeof closed == 'function') {
							closed();
						}
					}
				});
		return false;
	},
	openDialog : function(title, url, width, height, target, hideBtn) {
		if(typeof(hideBtn) == 'undefined' || typeof(hideBtn) != 'boolean'){
			hideBtn = false;
		}
		layer.open({
			type : 2,
			area : [ width, height ],
			title : title,
			maxmin : true, // 开启最大化最小化按钮
			content : url,
			btn : hideBtn ? [] : [ '确定', '关闭' ],//增加一个button隐藏参数
			yes : function(index, layero) {
				var body = layer.getChildFrame('body', index);
				var iframeWin = layero.find('iframe')[0]; // 得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
				var inputForm = body.find('#inputForm');
				var top_iframe;
				if (target) {
					top_iframe = target;// 如果指定了iframe，则在改frame中跳转
				} else {
					top_iframe = top.getActiveTab().attr("name");// 获取当前active的tab的iframe
				}
				inputForm.attr("target", top_iframe);// 表单提交成功后，从服务器返回的url在当前tab中展示

				if (iframeWin.contentWindow.doSubmit()) {
					layer.close(index);// 关闭对话框。
				}
			},
			cancel : function(index) {
			}
		});
	},
	InitLayerContent : function(url, loadFun, param, divId) {
		// fdw 放回20160604 10:13 周六
		if (!url.startWith("http") && !url.startWith(APP_ROOT)
				&& !url.startWith(WEB_ROOT)) {
			url = window.APP_ROOT + url;
		}
		urlUtil.initUrlPars(url);
		// 如果不带，参数传到springmvc后台的时候就没有了，影响通讯录编辑模块
		if (param != '1') {
			if (url.indexOf('?') > 0)
				url = url.substr(0, url.indexOf('?'));
		}
		// $(".layui-layer-content").load(url, function() {
		if (typeof (divId) == "undefined") {
			divId = ".layui-layer-content"
		} else {
			divId = "#" + divId
		}
		
		$($(divId)[$(divId).length-1]).load(url, function() {
			if (typeof loadFun == 'function') {
				loadFun();
			}
		});
	},
	openDialogHtml : function(title, url, width, height, loadFun, callback, hideBtn) {
		var strDivId = win.getCharacter(6);
		layer.open({
			type : 1,
			area : [ width, height ],
			title : title,
			maxmin : true, // 开启最大化最小化按钮
			content : '<div id="' + strDivId
					+ '" style="width:100%;height:100%;"></div>',
			btn : hideBtn ? [] : [ '确定', '关闭' ],
			yes : function(index, layero) {
				if (typeof callback == 'function') {
					// 传过来的是执行方法
					var resu = callback();
					if (typeof (resu) != 'undefined' && !resu) {
						return;
					}
					layer.close(index);// 关闭对话框。
				} else {
					// iframeWin.contentWindow.doSubmit();
				}
			},
			cancel : function(index) {
			},
			end : function() {

			},
			full : function() {
				var height = document.body.offsetHeight - 100;
				$(".layui-layer-content").height(height);
				$("#" + strDivId).height(height);
				// 派发事件
				require([ 'dojo/topic' ], function(topic) {
					topic.publish("/layer/full");
				});
			},
			restore : function() {
				var iHei = parseInt(height) - 100;
				$(".layui-layer-content").css('height', iHei + 'px');
				$("#" + strDivId).css('height', iHei + 'px');
				// 派发事件
				require([ 'dojo/topic' ], function(topic) {
					topic.publish("/layer/restore");
				});
			}
		});
		if (url.indexOf('.jsp') < 0) {
			this.InitLayerContent(url, loadFun, '1', strDivId);
		} else
			this.InitLayerContent(url, loadFun, null, strDivId);
		document.onkeydown = function(event) {
			var e = event || window.event
					|| arguments.callee.caller.arguments[0];
			if (e && e.keyCode == 27) { // 按 Esc
				layer.closeAll();
			}
		};
	},openDialogJsp : function(title, url, width, height, loadFun, callback, hideBtn) {
		var strDivId = win.getCharacter(6);
		layer.open({
			type : 1,
			area : [ width, height ],
			title : title,
			maxmin : true, // 开启最大化最小化按钮
			content : '<div id="' + strDivId
					+ '" style="width:100%;height:100%;"></div>',
			btn : hideBtn ? [] : [ '确定', '关闭' ],
			yes : function(index, layero) {
				if (typeof callback == 'function') {
					// 传过来的是执行方法
					var resu = callback();
					if (typeof (resu) != 'undefined' && !resu) {
						return;
					}
					layer.close(index);// 关闭对话框。
				} else {
					// iframeWin.contentWindow.doSubmit();
				}
			},
			cancel : function(index) {
			},
			end : function() {

			},
			full : function() {
				var height = document.body.offsetHeight - 100;
				$(".layui-layer-content").height(height);
				$("#" + strDivId).height(height);
				// 派发事件
				require([ 'dojo/topic' ], function(topic) {
					topic.publish("/layer/full");
				});
			},
			restore : function() {
				var iHei = parseInt(height) - 100;
				$(".layui-layer-content").css('height', iHei + 'px');
				$("#" + strDivId).css('height', iHei + 'px');
				// 派发事件
				require([ 'dojo/topic' ], function(topic) {
					topic.publish("/layer/restore");
				});
			}
		});

			this.InitLayerContent(url, loadFun, 1, strDivId);
		document.onkeydown = function(event) {
			var e = event || window.event
					|| arguments.callee.caller.arguments[0];
			if (e && e.keyCode == 27) { // 按 Esc
				layer.closeAll();
			}
		};
	},
	openDialogNoHtml : function(title, obj, width, height, loadFun, callback) {
		var strDivId = win.getCharacter(6);
		layer.open({
			type : 1,
			area : [ width, height ],
			title : title,
			maxmin : true, // 开启最大化最小化按钮
			content : '<div id="' + strDivId
					+ '" style="width:100%;height:100%;"></div>',
			btn : [ '确定', '关闭' ],
			yes : function(index, layero) {
				if (typeof callback == 'function') {
					// 传过来的是执行方法
					var resu = callback();
					if (typeof (resu) != 'undefined' && !resu) {
						return;
					}
					layer.close(index);// 关闭对话框。
				} else {
					layer.close(index);// 关闭对话框。
				}
			},
			cancel : function(index) {
			},
			end : function() {

			}
		});
		$('#' + strDivId).append(obj);
		$('#' + strDivId).css("overflow", "hidden");
	},
	openDialogHtml_other : function(title, url, width, height, loadFun,
			callback) {
		var strDivId = win.getCharacter(6);
		layer.open({
			type : 1,
			area : [ width, height ],
			title : title,
			maxmin : true, // 开启最大化最小化按钮
			content : '<div id="' + strDivId
					+ '" style="width:100%;height:100%;"></div>',
			btn : [],
			yes : function(index, layer) {
				if (typeof callback == 'function') {
					// 传过来的是执行方法
					var resu = callback();
					if (typeof (resu) != 'undefined' && !resu) {
						return;
					}
					top.layer.close(index);// 关闭对话框。
				} else {
					// iframeWin.contentWindow.doSubmit();
				}
			},
			cancel : function(index) {
			},
			end : function() {

			}
		});
		this.InitLayerContent(url, loadFun, null, strDivId);
	},
	openDialogHtmlMax : function(title, url, width, height, loadFun, callback) {
		var strDivId = win.getCharacter(6);
		var index = top.layer.open({
			type : 1,
			area : [ width, height ],
			title : title,
			maxmin : true, // 开启最大化最小化按钮
			content : '<div id="' + strDivId
					+ '" style="width:100%;height:100%;"></div>',
			yes : function(index, layer) {
				if (typeof callback == 'function') {
					// 传过来的是执行方法
					callback();
					top.layer.close(index);// 关闭对话框。
				} else {
					// iframeWin.contentWindow.doSubmit();
				}
			},
			cancel : function(index) {
			},
			end : function() {

			}
		});
		this.InitLayerContent(url, loadFun, null, strDivId);
		layer.full(index);
	},
	openDialogView : function(title, url, width, height, loadFun,oldExcution) {
		top.layer.open({
			type : 2,
			area : [ width, height ],
			title : title,
			maxmin : true, // 开启最大化最小化按钮
			content : url,
			btn : [ '关闭' ],
			cancel : function(index) {
			},
			success:function(dom, index) {//lanwei 20170103加载完成后回调 替换原有的InitLayerContent函数
				if (typeof loadFun == 'function') {
					if(oldExcution==null){
						loadFun();
					}
				}
			}
		});
		//使用详情页
		if(oldExcution!=null&&oldExcution==true){
			this.InitLayerContent(url, loadFun);
		}
		document.onkeydown = function(event) {
			var e = event || window.event
					|| arguments.callee.caller.arguments[0];
			if (e && e.keyCode == 27) { // 按 Esc
				layer.closeAll();
			}
		};
	},
	openRightFull : function(title, url, width, loadFun) {
		// 用于右侧开小窗top.win.openRightFull('历史同期对比','index.jsp',500);
		var strDivId = win.getCharacter(6);
		if (layer)
			layer.closeAll();
		var height = $(window).height() - 52;
		var strUrl = url;
		if (typeof (loadFun) != "undefined") {
			strUrl = '<div id="' + strDivId
					+ '" style="width:100%;height:100%;"></div>';
		}
		layer.open({
			type : 1 // 此处以iframe举例
			,
			title : title,
			area : [ width + 'px', height + 'px' ],
			shade : 0,
			offset : [ // 为了演示，随机坐标
			52, ($("body").width() - width) ],
			content : strUrl,
			btn : [ '关闭' ] // 只是为了演示
			,
			yes : function() {
				layer.closeAll();
			},
			btn2 : function() {
				layer.closeAll();
			},
			zIndex : layer.zIndex // 重点1
			,
			success : function(layero) {
				layer.setTop(layero); // 重点2
			}
		});
		if (typeof (loadFun) != "undefined") {
			this.InitLayerContent(url, loadFun, null, strDivId);
		}
	},
	getCharacter : function(ilen) {
		var charList = '';
		for (var i = 0; i < ilen; i++) {
			var character = String.fromCharCode(Math.floor(Math.random() * 26)
					+ "a".charCodeAt(0));
			charList += character;
		}
		return charList;
	},openDialogWidget : function(title, widget, width, height, loadFun, callback, hideBtn) {
		/*所有dojo的弹出统一使用这个方法，用于替换popup，建议项目中所有弹窗都使用layer*/
		/*var panel = new this.PopClass({data : _this.imgZoomData,scaleInfo : scaleInfo});win.openDialogWidget('打开的面板', panel, width + 'px', height + 'px',null, null, true);*/
		var strDivId = win.getCharacter(6);
		var layerindex = layer.open({
			type : 1,
			area : [ width, height ],
			title : title,
			maxmin : true, // 开启最大化最小化按钮
			content : '<div id="' + strDivId+ '" style="width:100%;height:100%;"></div>',
			btn : hideBtn ? [] : [ '确定', '关闭' ],
			yes : function(index, layero) {
				if (typeof callback == 'function') {
					// 传过来的是执行方法
					var resu = callback();
					if (typeof (resu) != 'undefined' && !resu) {
						return;
					}
					layer.close(index);// 关闭对话框。
				} else {
					// iframeWin.contentWindow.doSubmit();
				}
			},
			cancel : function(index) {
			},
			end : function() {
			},
			full : function() {
				var height = document.body.offsetHeight - 100;
				$(".layui-layer-content").height(height);
				$("#" + strDivId).height(height);
				// 派发事件
				require([ 'dojo/topic' ], function(topic) {
					topic.publish("/layer/full");
				});
			},
			restore : function() {
				var iHei = parseInt(height) - 100;
				$(".layui-layer-content").css('height', iHei + 'px');
				$("#" + strDivId).css('height', iHei + 'px');
				// 派发事件
				require([ 'dojo/topic' ], function(topic) {
					topic.publish("/layer/restore");
				});
			}
		});
		if(widget instanceof Object){
			$("#" + strDivId).append(widget.domNode);
			widget.startup();
		}
		return layerindex;
	},
	openDialogWidgetPosition:function(title, widget,top,left, width, height, loadFun, callback, hideBtn,showSizeBtn,shadeOpcity){
		// title 标题 widget 放入的widget组件 top 弹框距离上部窗口的距离 left 距离左侧窗口的距离 width 弹框宽度 height 弹框高度 
		// loadFlun 弹框加载完成执行的函数 callback 点击确定按钮执行的函数 hideBtn 是否显示确定 和取消按钮 showSizeBtn 是否显示放大缩小按钮
		// shadeOpcity 遮罩层的透明度 false 透明度为0 其他则按照传入的
		var strDivId = win.getCharacter(6);
		var layerindex = layer.open({
			type : 1,
			area : [ width, height ],
			title : title,
			maxmin : showSizeBtn===false?showSizeBtn:true, // 开启最大化最小化按钮
			content : '<div id="' + strDivId+ '" style="width:100%;height:100%;"></div>',
			shade:shadeOpcity===false?0:shadeOpcity?shadeOpcity:0.3,
			offset : [ top, left ],//随机坐标
			btn : hideBtn ? [] : [ '确定', '关闭' ],
			yes : function(index, layero) {
				if (typeof callback == 'function') {
					// 传过来的是执行方法
					var resu = callback();
					if (typeof (resu) != 'undefined' && !resu) {
						return;
					}
					layer.close(index);// 关闭对话框。
				} else {
				}
			},
			cancel : function(index) {
			},
			end : function() {
			},
			full : function() {
				var height = document.body.offsetHeight - 100;
				$(".layui-layer-content").height(height);
				$("#" + strDivId).height(height);
				// 派发事件
				require([ 'dojo/topic' ], function(topic) {
					topic.publish("/layer/full");
				});
			},
			restore : function() {
				var iHei = parseInt(height) - 100;
				$(".layui-layer-content").css('height', iHei + 'px');
				$("#" + strDivId).css('height', iHei + 'px');
				// 派发事件
				require([ 'dojo/topic' ], function(topic) {
					topic.publish("/layer/restore");
				});
			}
		});
		if(widget instanceof Object){
			$("#" + strDivId).append(widget.domNode);
			widget.startup();
		}
		return layerindex;
	}
}
// ***************************URL传参处理******************************//

var URL_PARAMS = new Object();
var urlUtil = {
	getQueryValue : function(paramname) // 获取url参数值
	{
		var reg = new RegExp("(^|&)" + paramname + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return unescape(r[2]);
		return null;
	},
	initUrlPars : function(url) {
		URL_PARAMS = new Object();
		if (url.indexOf("?") != -1) {
			var str = url.substring(url.indexOf("?") + 1);
			strs = str.split("&");
			for (var i = 0; i < strs.length; i++) {
				var sTemp = strs[i].split("=");
				URL_PARAMS[sTemp[0]] = (sTemp[1]);
			}
		}
	},
	// 获取load方式的url参数
	getRequest : function(param) {
		if (typeof (URL_PARAMS[param]) == 'undefined')
			return '';
		return URL_PARAMS[param];
	},
	getUrlRequest : function(strName) {
		var url = location.search;
		var Request = new Object();
		if (url.indexOf("?") != -1) {
			var str = url.substr(1);
			strs = str.split("&");
			for (var i = 0; i < strs.length; i++) {
				Request[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		var strReturn = Request[strName];
		if (typeof (strReturn) == "undefined") {
			return "";
		} else {
			return strReturn;
		}
	}
}
// 弹出大的chart图
var cha = {
	showBig : function(type, url, queryparam, config,_allTypeMarkLine) {
		console.log(config);
		layer.open({
			type : 1,
			area : [ '800px', '600px' ],
			title : '图形',
			maxmin : true, // 开启最大化最小化按钮
			content : '',
			btn : [ '关闭' ],
			yes : function(index, layero) {
				layer.close(index);// 关闭对话框。
			},
			cancel : function(index) {
			},
			end : function() {

			}
		});
		if (typeof (config) != "undefined") {
			config = JSON.parse(config);
			config["tool"] = false;
			config["titleClickForbidden"] = true;
		}
		if (typeof (queryparam) != "undefined")
			queryparam = JSON.parse(queryparam);
		else
			queryparam = null;
		if (type == "scatterChart") {
			require([ "base/chart/ChartFor3Util" ], function(chartUtil) {
				chartUtil.scatterChart("layui-layer-content", url, queryparam,
						config);
			});
		} else if (type == "BoxChart") {
			require([ "base/chart/ChartFor3Util" ], function(chartUtil) {
				chartUtil.BoxChart("layui-layer-content", url, queryparam,
						config);
			});
		} else if (type == "LineWaveChart") {
			require([ "base/chart/ChartUtil" ], function(chartUtil) {
				chartUtil.LineWaveChart("layui-layer-content", url, queryparam,
						config);
			});
		} else if (type == "RadarChart") {
			require([ "base/chart/ChartUtil" ], function(chartUtil) {
				chartUtil.RadarChart("layui-layer-content", url, queryparam,
						config);
			});
		} else if (type == "CommonChart") {
			require([ "base/chart/ChartFor3Util" ], function(chartUtil) {
				chartUtil.CommonChart("layui-layer-content", url, queryparam,
						config);
			});
		} else if (type == "WaterHistory") {
			require([ "base/chart/ChartFor3Util" ], function(chartUtil) {
				chartUtil.QualityWaterHistory("layui-layer-content", url, queryparam,
						config,_allTypeMarkLine);
			});
		}

	}
}

// ***************************底层代码修改仿zhz说法******************************//
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
// author: meizz
Date.prototype.Format = function(fmt) {
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
String.prototype.startWith = function(str) {
	var reg = new RegExp("^" + str);
	return reg.test(this);
}
String.prototype.endWith = function(str) {
	var reg = new RegExp(str + "$");
	return reg.test(this);
}
String.prototype.GetValue = function(para) {
	var reg = new RegExp("(^|&)" + para + "=([^&]*)(&|$)");
	var r = this.substr(this.indexOf("\?") + 1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}
String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
}
// 字符串转换为日期,如不符合的话转换为false
String.prototype.parseDate = function() {
	var ar = (this + ",0,0,0").match(/\d+/g);
	return ar[5] ? (new Date(ar[0], ar[1] - 1, ar[2], ar[3], ar[4], ar[5]))
			: false;
}
// 计算的字段 , 增量
Date.prototype.addDate = function(type, NumDay) {
	var date = new Date(this);
	type = parseInt(type) // 类型
	var lIntval = parseInt(NumDay)// 间隔
	switch (type) {
	case 6:// 年
		date.setYear(date.getYear() + lIntval)
		break;
	case 7:// 季度
		date.setMonth(date.getMonth() + (lIntval * 3))
		break;
	case 5:// 月
		date.setMonth(date.getMonth() + lIntval)
		break;
	case 4:// 天
		date.setDate(date.getDate() + lIntval)
		break;
	case 3:// 时
		date.setHours(date.getHours() + lIntval)
		break;
	case 2:// 分
		date.setMinutes(date.getMinutes() + lIntval)
		break;
	case 1:// 秒
		date.setSeconds(date.getSeconds() + lIntval)
		break;
	case 0:// 当天的开始
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		break;
	case 23:// 当天的结束
		date.setHours(23);
		date.setMinutes(59);
		date.setSeconds(59);
		break;
	default:
	}
	return date;
}
// 日期转换为字符 yyyy-mm-dd hh24:mi
Date.prototype.toFormatStr = function(x) {
	var year = this.getFullYear();
	var mm = (this.getMonth() + 1) < 10 ? ("0" + (this.getMonth() + 1)) : (this
			.getMonth() + 1);
	var day = (this.getDate()) < 10 ? ("0" + this.getDate()) : (this.getDate());
	var hour = (this.getHours() < 10) ? ("0" + this.getHours()) : (this
			.getHours());
	var min = (this.getMinutes() < 10) ? ("0" + this.getMinutes()) : (this
			.getMinutes());
	var sec = (this.getSeconds() < 10) ? ("0" + this.getSeconds()) : (this
			.getSeconds());
	if (x) {
		if (x == 1) // 天
		{
			return year + "-" + mm + "-" + day;
		} else if (x == 2) // 小时
		{
			return year + "-" + mm + "-" + day + " " + hour;
		} else if (x == 3) //
		{
			return year + "年" + mm + "月" + day + "日&nbsp;" + hour + ":" + min
					+ "&nbsp;" + week[this.getDay()];
		} else if (x == 4) {
			return year + "-" + mm;
		} else if (x == 41) {
			return mm;
		} else if (x == 5) {
			return year + '' + mm + '' + day;
		} else if (x == 60) {
			return "" + mm + "-" + day + " " + hour;
		} else if (x == 7) {
			return "" + mm + "月" + day + "日";
		} else if (x == 8) {
			return "" + day + "日" + hour + "时";
		} else if (x == 9) {
			return "" + hour + "时";
		} else if (x == 10) {
			return year + "-" + mm + "-" + day + " " + hour + ":" + min + ":"
					+ sec;
		} else if (x == 11) {
			return day + "";
		} else // 分
		{
			return year + "-" + mm + "-" + day + " " + hour + ":" + min;
		}
	} else {

		return year + "-" + mm + "-" + day + " " + hour + ":" + min;
	}
}
var CheckFormChange = {
	init : function() {
		var pageDataChange = false;
		var tagName = "Input, Select, Textarea";
		var ctrlIds = [];
		$.fn.MonitorDataChange = function(options) {
			pageDataChange = false;
			var deafult = {
				arrTags : tagName, // 需监控控件的tagName属性
				arrCtrls : ctrlIds
			// 不监控的控件ID
			};
			var ops = $.extend(deafult, options);
			tagName = ops.arrTags;
			ctrlIds = ops.arrCtrls;
			/* 元素第一次获取焦点时缓存该元素数据 */
			$(ops.arrTags).one("focus", function() {
				if ($.inArray($(this).attr("id"), ops.arrCtrls) != -1) {
					return;
				}
				$(this).data('initData', $(this).val());
			});
		};
		/* 获取页面数据是否已经改变 */
		$.fn.isChange = function() {
			$(tagName).each(function() {
				if ($.inArray($(this).attr("id"), ctrlIds) != -1) {
					return;
				}
				/* 如果该元素的initData缓存数据已定义并且不等于他的value值，标识该页面中数据发生变化 */
				if (typeof ($(this).data('initData')) != 'undefined') {
					if ($(this).data('initData') != $(this).val()) {
						pageDataChange = true;
					}
				}
			});
			return pageDataChange;
		};
	}
}
// 初始化数据是否发生变化使用
$(document).ready(function() {
	CheckFormChange.init();
});

// (function($){
// //首先备份一个原始的jquery.ajax()函数
// var _ajax = $.ajax;
// //重写jquery.ajax()函数
// $.ajax = function(options){
// // options.type = 'POST';
// options.error = function(XMLHttpRequest, msg, e){
// //统一错误处理
// ShowError(msg,"服务出错");
// }
// }
// })(jQuery);

// 全局的AJAX访问，处理AJAX清求时SESSION超时
$.ajaxSetup({
	complete : function(XMLHttpRequest, status) {
		try {
			if(status == 'error'){
				var tempStr=XMLHttpRequest.responseText;
				if(tempStr && tempStr.indexOf("错误页 Error Page")>0){
					ShowToast(tempStr.substring(tempStr.indexOf('#errorMessageInfoStart#'),tempStr.indexOf('#errorMessageInfoEnd#')).replace('#errorMessageInfoStart#',''),'提示信息','error');
				}else if( XMLHttpRequest.status == "200"){ // 兼容调试时301/302重定向导致触发error的问题
	                console.log(XMLHttpRequest);
	                return;
	            }else if( XMLHttpRequest.status == "404"){
	                //console.log(XMLHttpRequest);
	                return;
	            }else{
					ShowToast("请求超时，请重新登录",'提示信息','error');
/*					setTimeout(function(){
						if(APP_ROOT){
							top.location.href=APP_ROOT+"index.jsp";
						}else{
							top.location.href="/index.jsp";
						}
					},2000);
*/
				}
				
			}
		}catch(err){
			console.error(err);
		}

	}
});
//全局信息提示框

function ShowSuccess(message,title){
    toastr.options = {
            closeButton: true,
            progressBar: true,
            showMethod: 'slideDown',
            timeOut: 4000,
            positionClass: "toast-top-center"
    };
    if(title=='')
        title="成功";
    toastr.success(message, title);
}
function ShowWarn(message,title){
    toastr.options = {
            closeButton: true,
            progressBar: true,
            showMethod: 'fadeIn',
            timeOut: 4000,
            positionClass: "toast-top-center"
    };
    if(title=='')
        title="警告";
    toastr.warning(message, title);
}
function ShowError(message,title){
    toastr.options = {
            closeButton: true,
            progressBar: true,
            showMethod: 'fadeIn',
            timeOut: 40000,
            positionClass: "toast-top-center"
    };
    if(title=='')
        title="错误";
    toastr.error(message, title);
}
function ShowInfo(message,title){
    toastr.options = {
            closeButton: true,
            progressBar: true,
            showMethod: 'slideDown',
            timeOut: 4000,
            positionClass: "toast-top-center"
    };
    if(title=='')
        title="提示";
    toastr.info(message, title);
}
function ShowToast(message,title,type){
    if(type=='info'||type=='')
        ShowInfo(message, title);
    else if(type=='warn')
        ShowWarn(message, title);
    else if(type=='error')
        ShowError(message, title);
    else if(type=='success')
        ShowSuccess(message, title);
}

//公共方法，获取url传值
function getRequest(strName)
{
    var url=location.search;
    var Request = new Object();
    if(url.indexOf("?")!=-1)
    {
    var str = url.substr(1);
    strs = str.split("&");
    for(var i=0;i<strs.length;i++)
    {
     Request[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
    }
    }
    var strReturn=Request[strName];
    if(typeof(strReturn)=="undefined")
        {return "";}
    else
        {return strReturn;} 
}
// lanwei,此方法类似java代码AdcdUtil.getPrefixAdcd
var adcdUtil = {
		cutEndZeroRegExp : /0+$/g,
		prefixAdcd : function(_adcd, ignore) { //获取最短政区
			return _adcd.substring(0, this.prefixAdcdLen(_adcd, ignore));
		}, 
		prefixAdcdLen : function  (_adcd, ignore) {//获取最短政区长度
			var isDigit = this.checkDigit(_adcd);
			if (isDigit) {
				var cdLen = _adcd.replace(this.cutEndZeroRegExp, '').length;
				return cdLen > 6 ? (ignore ? 6 : (cdLen % 3 !== 0 ? cdLen + (3 - cdLen % 3) : cdLen)) : (cdLen % 2 !== 0 ? cdLen + 1 : cdLen);
			} else {
				throw new Error( "请传递政区的政区参数" ); 
			}
		},
		checkDigit : function(_adcd) {
			var isDigit = true, digitRegExp = /^[0-9]{1,15}$/;
			return digitRegExp.test(_adcd);
		},
		getApplicationType:function(adcdStr){
			//0国家,1省,2市,3县,4乡镇,5行政村,6村组
			var type = adcdStr.replace(/0+$/,"");
			var len = type.length;
			if(len <= 6){
				if(len > 4){
					return 3;
				}else if(len > 2){
					return 2;
				}else if(len > 0){
					return 1;
				}else{
					return 0;
				}
			}else{
				if(len <= 9){
				    return 4;
				}else if(len <= 12) {
					return 5;
				}else{
					return 6;
				}
			}
		}
}
