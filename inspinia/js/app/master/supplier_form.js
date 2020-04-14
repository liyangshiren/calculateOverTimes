$(document).ready(function () {
	/* form init validation */
	var oldPlantId = $("#oldPlantId").val();
	var oldNo = $("#oldNo").val();
	var oldName = $("#oldName").val();
	var oldDesciption = $("#oldDesciption").val();
	var form = $("#tblForm");

	// 提交当前活动的form，多个tab时候需要知道当前的tab
	$(":submit", "#buttons").on("click", function (e) {
		form.submit();
	});

	var checkNo = {
        remote: {
        	type:"GET",
        	url:baseUrl + "/check/plantIdAndNo",
        	data:{
        		oldPlantId:oldPlantId,
        		plantId:function(){
        			return $("#plant").val();
        		},
    			oldNo:oldNo,
    			no:function(){
        			return $("#no").val();
        		}
        	}
        },
        alnum : true,
		maxlength: 50
	};
	
	// JQuery validate 插件看文档
	// form validation
	form.validate({
		rules: {
			no: checkNo,
			email : {email : true}
		},
		messages: {
			no: {
				remote: "该供应商编号在工厂下已被使用!"
			}
		}
	});
});