$(document).ready(function () {
	/* form init validation */
	var operType = $("#operType").val();
//	var oldDesciption = $("#oldDesciption").val();
	var form = $("#tblForm");

	//工厂下拉搜索
	$("#plant").select2({
		ajax : {
			url : rootUrl + "/api/master/plants",
		}
	});
	
	//库位下拉搜索
	$("#loc").linkSelect2("dloc", rootUrl + "/api/master/locs", "dloc");
	
	//用户下拉搜索
	$("#user").select2({
		ajax : {
			url : rootUrl + "/api/master/users",
		}
	});
	
	// 提交当前活动的form，多个tab时候需要知道当前的tab
	$(":submit", "#buttons").on("click", function (e) {
		form.submit();
	});

	var checks = {
        remote: {
        	type:"GET",
        	url:baseUrl + "/check/plantIdAndLocIdAndOperType",
        	data:{
        		oldPlantId:oldPlantId,
        		plantId:function(){
        			return $("#plant").val();
        		},
        		oldUserId:oldUserId,
        		userId:function(){
        			return $("#user").val();
        		},
        		oldLocId:oldLocId,
        		locId:function(){
        			return $("#loc").val();
        		},
        		oldOperType:oldOperType,
        		operType:function(){
        			return $("#operType").val();
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
			loc: checks
		},
		messages: {
			loc: {
				remote: "该库位编码在该工厂该作业类型已被使用!"
			}
		}
	});
	
	$('#isdefault').change(function(){
//		console.log(oldPlantId);
		var oldIsdefault = $('#oldIsdefault').val();
		console.log(oldIsdefault);
		if(!$('#isdefault').is(':checked') && oldIsdefault == 'true')
		{
//		console.log('122')
			$('#isdefault').prop("checked",true); //标准写法，推荐！
			toastr.warning('不能取消【默认】选择!'); 
		}
	});
	
	$('#enabled').change(function(){
		if($('#isdefault').is(':checked') && !$('#enabled').is(':checked'))
		{
			$('#enabled').prop("checked",true); //标准写法，推荐！
			toastr.error('【默认】状态的用户关系不能取消激活!');
		}
	});
	
	
});