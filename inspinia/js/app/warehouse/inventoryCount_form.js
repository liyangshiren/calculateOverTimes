$(document).ready(function() {

	$("#plant").select2({
		ajax : {
			url : rootUrl + "/api/master/plants",
		}
	});

	// 仓库
	$("#countWareHouse").linkSelect2("plant", rootUrl + "/api/master/warehouses", "plant");

	$('#planStart').datetimepicker({
		format : 'yyyy-mm-dd hh:ii:ss',
		todayBtn : "linked",
		calendarWeeks : true,
		autoclose : true,
		startDate : new Date(),
		pickerPosition : "bottom-left"
	});

	$("#planStart").on('change', function() {
		$('#planEnd').datetimepicker('setStartDate', $(this).val());
	})

	$('#planEnd').datetimepicker({
		format : 'yyyy-mm-dd hh:ii:ss',
		todayBtn : "linked",
		calendarWeeks : true,
		autoclose : true,
		pickerPosition : "bottom-left"
	});
/*
	$('#dynamicStart').datetimepicker({
		minView : "month",
		format : 'yyyy-mm-dd',
		todayBtn : "linked",
		calendarWeeks : true,
		autoclose : true,
		endDate : new Date(),
		pickerPosition : "bottom-left"
	});

	$("#dynamicStart").on('change', function() {
		$('#dynamicEnd').datetimepicker('setStartDate', $(this).val());
	})

	$('#dynamicEnd').datetimepicker({
		minView : "month",
		format : 'yyyy-mm-dd',
		todayBtn : "linked",
		calendarWeeks : true,
		autoclose : true,
		endDate : new Date(),
		pickerPosition : "bottom-left"
	});

	var now = moment().format('YYYY-MM-DD');
	var dynamicEnd = $('#dynamicEnd').val();
	if (!dynamicEnd) {
		$('#dynamicEnd').val(now);
	}*/

	var form = $("#tblForm");
	var validate = form.validate({
		rules : {
			priority : {
				number : true,
				integerLength : 6,
				digits : true,
				min : 1
			},
			planStart : {
				date : true
			},
			planEnd : {
				date : true
			},
			/*dynamicStart : {
				date : true
			},
			dynamicEnd : {
				date : true
			},*/
			supplStr : {
				remote : {
					url : baseUrl + "/checkErrorNo/suppl",
					type : "post",
					dataType : 'text',
					data : {
						str : function() {
							return $("#supplStr").val();
						},
						plant : function() {
							return $("#plant").val();
						},
						warehouse : function() {
							return $("#countWareHouse").val();
						}
					},
					dataFilter : function(data) {
						if (data != "true") {
							$("#supplSpan").text(data);
							return false;
						} else {
							$("#supplSpan").text("");
							return true;
						}
					}
				}
			},
			partStr : {
				remote : {
					url : baseUrl + "/checkErrorNo/part",
					type : "post",
					dataType : 'text',
					data : {
						str : function() {
							return $("#partStr").val();
						},
						plant : function() {
							return $("#plant").val();
						},
						warehouse : function() {
							return $("#countWareHouse").val();
						}
					},
					dataFilter : function(data) {
						if (data != "true") {
							$("#partSpan").text(data);
							return false;
						} else {
							$("#partSpan").text("");
							return true;
						}
					}
				}
			},
			dlocStr : {
				remote : {
					url : baseUrl + "/checkErrorNo/dloc",
					type : "post",
					dataType : 'text',
					data : {
						str : function() {
							return $("#dlocStr").val();
						},
						plant : function() {
							return $("#plant").val();
						},
						warehouse : function() {
							return $("#countWareHouse").val();
						}
					},
					dataFilter : function(data) {
						if (data != "true") {
							$("#dlocSpan").text(data);
							return false;
						} else {
							$("#dlocSpan").text("");
							return true;
						}
					}
				}
			},
			locStr : {
				remote : {
					url : baseUrl + "/checkErrorNo/loc",
					type : "post",
					dataType : 'text',
					data : {
						str : function() {
							return $("#locStr").val();
						},
						plant : function() {
							return $("#plant").val();
						},
						warehouse : function() {
							return $("#countWareHouse").val();
						}
					},
					dataFilter : function(data) {
						if (data != "true") {
							$("#locSpan").text(data);
							return false;
						} else {
							$("#locSpan").text("");
							return true;
						}
					}
				}
			}
		}
	});

	// 盘点类型选择2时，动态开始日期和结束日期为必输项；
	$("#countType").on('change', function() {
		// 清除设置
//		$("#dynamicStart").rules("remove", "required");
//		$("#dynamicEnd").rules("remove", "required");
		$('input[name=supplStr]').removeAttr("readonly");
		$('input[name=partStr]').removeAttr("readonly");
		$('input[name=dlocStr]').removeAttr("readonly");
		$('input[name=locStr]').removeAttr("readonly");

		$("#supplStr").inputarea();
		$("#partStr").inputarea();
		$("#dlocStr").inputarea();
		$("#locStr").inputarea();

		var countType = $(this).val();
		if (countType == '2') {
//			$("#dynamicStart").rules("add", {
//				required : true
//			});
//			$("#dynamicEnd").rules("add", {
//				required : true
//			});
		} else if (countType == '1') {
			$('input[name=supplStr]').attr("readonly", "readonly");
			$('input[name=partStr]').attr("readonly", "readonly");
			$('input[name=dlocStr]').attr("readonly", "readonly");
			$('input[name=locStr]').attr("readonly", "readonly");

			$('input[name=supplStr]').unbind();
			$('input[name=partStr]').unbind();
			$('input[name=dlocStr]').unbind();
			$('input[name=locStr]').unbind();

		}
	})

	var supplReadOnly = $("#supplStr").attr("readonly");
	if (supplReadOnly) {
		$('input[name=supplStr]').unbind();
	} else {
		$('input[name=supplStr]').inputarea();
	}

	var partReadOnly = $("#partStr").attr("readonly");
	if (partReadOnly) {
		$('input[name=partStr]').unbind();
	} else {
		$('input[name=partStr]').inputarea();
	}

	var dlocReadOnly = $("#dlocStr").attr("readonly");
	if (dlocReadOnly) {
		$('input[name=dlocStr]').unbind();
	} else {
		$('input[name=dlocStr]').inputarea();
	}

	var locReadOnly = $("#locStr").attr("readonly");
	if (locReadOnly) {
		$('input[name=locStr]').unbind();
	} else {
		$('input[name=locStr]').inputarea();
	}
})