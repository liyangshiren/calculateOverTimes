$(document).ready(function() {

	$('.form_datetime').datetimepicker({
		minView : "month",
		format : 'yyyy-mm-dd',
		todayBtn : "linked",
		calendarWeeks : true,
		autoclose : true,
		pickerPosition : "bottom-left"
	});
	
	var form = $("#projectItemForm");

	// JQuery validate 插件看文档
	// form validation
	form.validate({
		rules : {
			no : {
				remote : baseUrl + "/check/no?oldNo=" + oldNo,
				maxlength : 10
			},
			name : {
				remote : baseUrl + "/check/name?oldName=" + oldName,
				maxlength : 128
			},
			startTime : {
				 required: true
			}
		},
		messages : {
			no : {
				remote : "该项目编号已被使用!"
			},
			name : {
				remote : "该项目名称已被使用!"
			}
		}
	});
});
