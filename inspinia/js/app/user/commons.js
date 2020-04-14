var stripeShow = false;
var stripeShowReport = true;

function isEmpty(str){
	return str == null || str.length == 0;
}
/**
 * 阻止事件冒泡
 * @param event
 */
function stopPropagation(event){
	var e = window.event || event;
	if ( e.stopPropagation ){
		//如果提供了事件对象，则这是一个非IE浏览器
		e.stopPropagation();
	}else{
		//兼容IE的方式来取消事件冒泡
		window.event.cancelBubble = true;
	}
}
/**
 * Form表单转json，查询用
 */
function form2Json(id) {
	var arr = $("#" + id).serializeArray();
	var json = new Object();
	for (var i = 0; i < arr.length; i++) {
		json[arr[i].name] = arr[i].value;
	}
	return json;
}
/** 
 * 时间对象的格式化; 
 */  
function formatDate(date,format) {
	if(date==null || date.length==1)
		return "";
	format = format || "yyyy-MM-dd hh:mm:ss";
	date = new Date(date);
    var o = {  
        "M+" : date.getMonth() + 1, // month  
        "d+" : date.getDate(), // day  
        "h+" : date.getHours(), // hour  
        "m+" : date.getMinutes(), // minute  
        "s+" : date.getSeconds(), // second  
        "q+" : Math.floor((date.getMonth() + 3) / 3), // quarter  
        "S" : date.getMilliseconds()  
    };
    if (/(y+)/.test(format)) {  
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4  
                        - RegExp.$1.length));  
    }  
    for (var k in o) {  
        if (new RegExp("(" + k + ")").test(format)) {  
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));  
        }  
    }  
    return format;  
}

/**
 * 秒转字符串（N天H时M分S秒）
 */
function second2String(s){
	if(isEmpty(s) || s == 0)
		return 0;
	var date=0,hour=0,minute=0,second=0;
	if(s >= 86400){
		date = Math.floor(s/86400);
		s -= date * 86400;
	}
	if(s >= 3600){
		hour = Math.floor(s/3600);
		s -= hour * 3600;
	}
	if(s >= 60){
		minute =  Math.floor(s/60);
		s -= minute * 60;
	}
	second = Math.floor(s);
	return (date == 0 ? "" : date + "天")
			+ (date + hour == 0 || date + hour + minute + second == 0 ? "" : hour + "小时")
			+ (date + hour + minute == 0 || minute + second == 0 ? "" : minute + "分钟")
			+ (second == 0 ? "" : second + "秒");
}

/**
 * 匹配#标签转成#标签
 * 输入:字符串
 * 输出:替换后的字符串
 */
function formatSharp(str) {
	var begin = str.indexOf('#');
	if(begin >= 0) {
		var s_ = str.match('#[A-Za-z0-9\u4e00-\u9fa5_-]*#');
		if(s_ == null){
			return str;
		}
		if(""+s_=="##"){
			s_ = "#";
		}
		var end = begin + (""+s_).length;
		if(s_!="#"){
			s_ = '<span class="linkcolor">' + s_ + '</span>';
		}
		str = str.substring(0, begin) + s_ + (end < str.length ? formatSharp(str.substring(end, str.length)) : "");
	}
	return str;
}

/**
 * 匹配@标签转成a标签
 * 输入:字符串
 * 输出:替换后的字符串
 */
function formatAt(str) {
	var begin = str.indexOf('@');
	if(begin >= 0) {
		var s_ = str.match('@[A-Za-z0-9\u4e00-\u9fa5_-]*');
		if(s_ == null){
			return str;
		}
		var end = begin + (""+s_).length;
		if(s_ != "@" && s_ != "@ ")
			s_ = '<span class="linkcolor">' + s_ + '</span>';
		str = str.substring(0, begin) + s_ + (end < str.length ? formatAt(str.substring(end, str.length)) : "");
	}
	return str;
}

/**
 * 匹配http://标签
 * 输入:字符串
 * 输出:替换后的字符串
 */
function formatHttp(str) {
	var begin = str.indexOf('http://');
	if(begin >= 0) {
		var s_ = ""+str.match('http://[A-Za-z0-9_./?&#=]*');
		var end = begin + s_.length;
		if(s_ != "http://"){
			s_ = '<span class="linkcolor" url="'+ s_ +'">' + s_ + '</span>';
		}
		str = str.substring(0, begin) + s_ + (end < str.length ? formatHttp(str.substring(end, str.length)) : "");
	}
	return str;
}

//写cookies 
function setCookie(name,value) 
{ 
    var Days = 30; 
    var exp = new Date(); 
    exp.setTime(exp.getTime() + Days*24*60*60*1000); 
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); 
} 

//读取cookies 
function getCookie(name) 
{ 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
    if(arr=document.cookie.match(reg))
 
        return unescape(arr[2]); 
    else 
        return null; 
} 

//删除cookies 
function delCookie(name) 
{ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval=getCookie(name); 
    if(cval!=null) 
        document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
}

// Grid列居中显示数据
function gridColumnCenter(value,row,index){
	return "text-align:center;";
}

//Grid列右对齐显示数据
function gridColumnRight(value,row,index){
	return "text-align:right;";
}

//Grid导出Excel
function gridExportExcel(url,title,datagrid){
	var options = datagrid.datagrid("options");
	var params = options.queryParams;
	params.page = options.pageNumber;
	params.rows = options.pageSize;
	params.sort = options.sortName;
	params.order = options.sortOrder;
	$.ajax({
        url:url,
        data:params,
        success:function(data){
        	if(data != null){
        		window.open($('base').attr('href') + "file/temp/download?file="+data);
        		return;
        	}
        	$.messager.alert('提示信息','导出'+(title==null?"":title)+'数据失败','error');
        },
        error:function(){
        	$.messager.alert('提示信息','导出'+(title==null?"":title)+'数据失败','error');
        }
	});
}

/**
 * 输入框只读
 * @param e
 */
function inputToReadonly(e){
	e.attr("readonly","readonly");
	e.css({
		backgroundColor:"#fff",
		color:"lightgray",
		height: 18
	});
}

/**
 * 输入框可编辑
 * @param e
 */
function readonlyToInput(e){
	e.removeAttr("readonly");
	e.css({
		backgroundColor:"#fff",
		color:"#000",
		height: 18
	});
}

//tab进行刷新
function updateTab(url) {
    var tab = $('#mainTabs').tabs('getSelected');
    $("#mainTabs").tabs('update', {
//    	name:parent.$('#mainTabs').tabs('getSelected').panel('options').title,
	    tab: tab,
		options: {
		            href: url
		        }
	}); 
	tab.panel('refresh');
	
//	parent.$('#mainTabs').tabs('getSelected').panel('refresh', url);
}

//删除左右两端的空格
function trim(str){ 
	return str.replace(/(^\s*)|(\s*$)/g, '');
}
//删除左边的空格
function ltrim(str){ 
	return str.replace(/(^\s*)/g,'');
}
//删除右边的空格
function rtrim(str){ 
	return str.replace(/(\s*$)/g,'');
}

/**
 * 加密
 * @param word
 * @returns {*}
 */
function encrypt(word){
    var key = CryptoJS.enc.Utf8.parse("abcdefgabcdefg12");
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return encrypted.toString();
}

/**
 * 解密
 * @param word
 * @returns {*}
 */
function decrypt(word){
    var key = CryptoJS.enc.Utf8.parse("abcdefgabcdefg12");
    var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}