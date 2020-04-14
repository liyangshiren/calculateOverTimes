$(document).ready(function () {
	/* form init validation */

	// JQuery validate 插件看文档
	// form validation
  $("#userForm").validate({
		rules: {
            password:{
              checkPwd:true,
              checkPwdEqualUsername:true
            },
            confirmPassword: {
              equalTo: "#password"
            }
		},
    messages: {
      confirmPassword: {
        equalTo: "输入与上面相同的密码"
      }
    }
	});

  $.validator.addMethod("checkPwd",function(value,element,params){
    var checkPwd = new RegExp('^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{9,30}$');
    return this.optional(element)||checkPwd.test(value);
  },"*密码必须满足大于8位条件且至少包含大小写字母数字及特殊字符中的三种!");

  $.validator.addMethod("checkPwdEqualUsername",function(value,element,params){
    var pwd = $("#username").val();
    return $.isEmptyObject(pwd) || (value.search(pwd) == -1);
  },"*用户名信息不得包含在密码中");

});
