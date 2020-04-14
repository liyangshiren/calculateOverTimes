function checkBlankSpace(str,obj){
	if(str.length == 0){
		obj.hide();
		return
	}
	while(str.lastIndexOf(" ")>=0){
		str = str.replace(" ","");
	}
	if(str.length == 0){
		obj.show();
	}else{
		obj.hide();
	}
 }
$("#username").bind("blur",function(event){
	var value = event.target.value;
	checkBlankSpace(value,$("#usernametips"));
});
$("#password").bind("blur",function(event){
	var value = event.target.value;
	checkBlankSpace(value,$("#passwordtips"));
});
$(document).ready(function () {
	/* form init validation */
	$("#password").val("");
	$("#newPassword").val("");
	var oldUsername = $("#oldUsername").val();
	var oldEmail = $("#oldEmail").val();
	var form = $("#userForm");

	// JQuery validate 插件看文档
	// form validation
	form.validate({
		rules: {
			username: {
				// check username's existence
				remote: baseUrl + "/check/username?oldUsername=" + oldUsername
			},
			email: {
				// check username's existence
				remote: baseUrl + "/check/email?oldEmail=" + oldEmail
			},
			mobile: {
				mobileCN: true
			},
			confirmPassword: {
				equalTo: "#password"
			}
		},
		messages: {
			username: {
				remote: "该用户名已被使用!"
			},
			email: {
				remote: "该邮件地址已经被使用!"
			},
			confirmPassword: {
				equalTo: "输入与上面相同的密码"
			},
			mobile: {
				remote: "只能输入纯数字的手机号"
			}
		}
	});
});