


$(document).ready(function() {
	// $("#pack").hide();
	// $("#pack").attr("disabled", true);

	  // form validation
	$("#productionDetailForm").validate({
		rules : {
			requiredQty: {
                required: true,    //要求输入不能为空
                number: true,     //输入必须是数字
                min: 1,          //输入的数字不能为0或者负数
                digits:true		//必须是整数
            }
		},
		messages : {
			requiredQty: {
                required: "请输入数量",
                number: "请正确输入数字",
                min: "不能小于1",
                digits: "必须是整数"
            }
		}
	});
	
	var value = $(".requiredQtyCon")[0].defaultValue.split('.')[0];
	$(".requiredQtyCon")[0].defaultValue = value;
	
});


