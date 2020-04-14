(function(){
	//获取元素的纵坐标 
	function getTop(e){ 
		var offset = e.offsetTop; 
		if(e.offsetParent!=null)
			offset += getTop(e.offsetParent); 
		return offset; 
	} 
	//获取元素的横坐标 
	function getLeft(e){ 
		var offset = e.offsetLeft; 
		if(e.offsetParent!=null)
			offset += getLeft(e.offsetParent); 
		return offset; 
	} 
	
	$.fn.inputarea = function(param){
		var marginLeft = 0;
		if(param != null){
			if(param.marginLeft != null)
				marginLeft = param.marginLeft;
		}
		
		var self = this;
		var offsetTop = getTop(self[0]) + parseInt(self.css("height")) + 2;
		var offsetLeft = getLeft(self[0]) + marginLeft;
	
		var width = 250;
		var height = 380;
		
		var div = document.createElement('div');
		$(div).css({
			position: "absolute",
			border: "1px solid #d7d7d7",
			left: offsetLeft,
			top: offsetTop,
			width: width,
			height: height,
			zIndex: 100000,
			display: "none"
		});
		
		var areaDiv = document.createElement('div');
		$(areaDiv).css({
			position: "relative",
			width: width,
			height: height-25
		});
		
		var area = document.createElement('textarea');
		$(area).css({
			position: "relative",
			borderWidth:0,
			width: width-2,
			height: "100%",
			resize:"none"
		});
		
		var barDiv = document.createElement('div');
		$(barDiv).css({
			position: "relative",
			background: "#eee",
			width: "100%",
			height: 23,
			"line-height": "23px"
		});
		
		var itemlabel = document.createElement('span');
		$(itemlabel).css({
			marginLeft:5
		});
		
		$(areaDiv).append(area);
		$(div).append(areaDiv);
		$(barDiv).append(itemlabel);
		$(div).append(barDiv);
		$(document.body).append(div);
		
		var inputFocus = false;
		var areaFocus = false;
		
		$(self).focus(function(){
			inputFocus = true;
			
			var value = $(self).val();
			if(value.length == 0){
				$(area).val("");
				$(itemlabel).html("当前0项");
				$(self).css("color", "inherit");
			}else{
				var array = value.trim().split(",");
				value = array.join("\n");
				$(area).val(value);
				if(array.length >= 999) {
					$(itemlabel).html("<span style='color:red'>当前"+array.length+"项,最多支持999行</span>");
					$(self).css("color", "red");
				} else {
					$(itemlabel).html("当前"+array.length+"项");
					$(self).css("color", "inherit");
				}
			}
			
			$(div).show();
		});
		
		$(area).focus(function(){
			areaFocus = true;
			$(div).show();
		});
		
		$(self).blur(function(){
			inputFocus = false;
			
			var value = $(self).val();
			var array = value.trim().split(",");
			if(array.length >= 999) {
				$(itemlabel).html("<span style='color:red'>当前"+array.length+"项,最多支持999行</span>");
				$(self).css("color", "red");
			}
			
			setTimeout(function() {
				if(areaFocus == true)
					return;
				$(div).hide();
			}, 100);
		});
		
		$(area).blur(function(){
			areaFocus = false;
			
			var value = $(area).val();
			if(value.length == 0) {
				$(self).val("");
				$(self).css("color", "inherit");
			} else {
				var array = value.trim().split("\n");
				value = array.join(",");
				$(self).val(value);
				if(array.length >= 999) {
					$(itemlabel).html("<span style='color:red'>当前"+array.length+"项,最多支持999行</span>");
					$(self).css("color", "red");
				}else{
					$(self).css("color", "inherit");
				}
			}
			
			setTimeout(function() {
				if(inputFocus == true)
					return;
				$(div).hide();
			}, 100);
		});
	}
})();