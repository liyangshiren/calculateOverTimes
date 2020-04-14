$(document).ready(function () {
	var form = $("#pplForm");
	
	var checks = {
	        remote: {
	        	type:"GET",
	        	url:baseUrl + "/checkExists",
	        	data:{
					oldPlantId : oldPlantId,
					oldPartId : oldPartId,
					oldLocId : oldLocId,
					plantId : function() {
						return $("#plant").val();
					},
					partId : function() {
						return $("#partId").val();
					},
					locId : function() {
						return $("#locId").val();
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
			locId: checks
		},
		messages: {
			locId: {
				remote: "该工厂下零件只能对应一个打包库位!!!"
			}
		}
	});
	
	//工厂下拉搜索
	$("#plant").select2({
		ajax : {
			url : rootUrl + "/api/master/plants",
		}
	});
	//零件号下拉搜索
	$("#partId").linkSelect2("plant", rootUrl + "/api/master/parts", "plant");
	// 供应商下拉搜索
	$("#locId").linkSelect2("plant", rootUrl + "/api/master/locs", "plant");
	
	//编辑时工厂不能修改
	var plantValue = $('#plant').val();
	if(plantValue != ''){
		$('#plant').attr('disabled', "disabled").css('background-color','#EEEEEE;');
		$('#partId').attr('disabled', "disabled");
	}
});