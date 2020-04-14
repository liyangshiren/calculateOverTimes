$(document).ready(function () {
	//工厂下拉搜索
	$("#plant").select2({
		ajax : {
			url : rootUrl + "/api/master/plants",
		}
	});
	// 仓库
	$("#warehouse").linkSelect2("plant", rootUrl + "/api/master/warehouses", "plant");
	$("#loc").linkSelect2("warehouse", rootUrl + "/api/master/locs", "warehouse");
	// 仓库
	$("#lineWarehouse").linkSelect2("plant", rootUrl + "/api/master/warehouses", "plant");
	$("#lineLoc").linkSelect2("lineWarehouse", rootUrl + "/api/master/locs", "warehouse");
	
	/* form init validation */
	var form = $("#dockForm");

	// 提交当前活动的form，多个tab时候需要知道当前的tab
	$(":submit", "#buttons").on("click", function (e) {
		alert($("#loc").val());
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
			no: checkNo/**,
			name: {
				// check username's existence
				remote: baseUrl + "/check/name?oldName=" + oldName,
				maxlength: 100
			}**/
		},
		messages: {
			no: {
				remote: "该道口编号在工厂下已被使用!"
			},
			name: {
				remote: "该道口编号已经被使用!"
			}
		}
	});
});