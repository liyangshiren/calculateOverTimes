/*!
 * jQuery Validation Extend
 */

// 校验编号，只能输入字母、数字、字符_-
$.validator.addMethod("alnum", function(value, element) {
	return this.optional(element) || /^[a-zA-Z0-9_-]+$/.test(value);
}, "只能包括字母数字和字符_-");

//自定义validate验证输入的数字小数点位数不能大于N位
jQuery.validator.addMethod("decimalLength", function(value, element, param){
    var returnVal = true;
    inputZ=value;
    var ArrMen= inputZ.split(".");    //截取字符串
    if(ArrMen.length == 2 ) {
        if(ArrMen[1].length > param) {    //判断小数点后面的字符串长度
            returnVal = false;
            return false;
        }
    }
    return returnVal;
},$.validator.format("小数点后最多为 {0} 位")); //验证错误信息

//自定义validate验证输入的数字整数位数不能大于N位
jQuery.validator.addMethod("integerLength", function(value, element, param){
    var returnVal = true;
    inputZ = value;
    var ArrMen;
    if (inputZ.indexOf("-") > 0) {
    	ArrMen = inputZ.split("-");    //截取字符串
	    if(ArrMen.length == 2 ) {
	    	ArrMen = ArrMen[1].split(".");
		    if(ArrMen[0].length > param) {    //判断小数点后面的字符串长度
		        returnVal = false;
		        return false;
		    }
	    }
	} else  {
		ArrMen = inputZ.split(".");
	    if(ArrMen[0].length > param) {    //判断小数点后面的字符串长度
	        returnVal = false;
	        return false;
	    }
	}
    return returnVal;
},$.validator.format("整数位数最多为 {0} 位")); //验证错误信息
