$(document).ready(function() {
	/* form init validation */
	var form = $("#containerForward");

	// JQuery validate 插件看文档
	// form validation
	form.validate({
		rules : {
			partId : {
				remote : {
					type : "GET",
					url : baseUrl + "/shipments",
					data : {
						barcode : function() {
							return $("#barcode").val();
						},
						driver : function() {
							return $("#driver").val();
						},
						vehicleNumber : function() {
							return $("#vehicleNumber").val();
						},
						contact : function() {
							return $("#contact").val();
						},
						invoiceNo :function () {
							return $("#invoiceNo").val();
						},
						etdDate : function () {
							return $("#etdDate").val();
						}
					}
				}
			}
		},
		messages : {
			partId : {
				remote : "发运失败！"
			}
		}
	});

	var newDate = new Date();
	var t = newDate.toJSON();
	$('.form_datetime').datetimepicker({
		format: 'yyyy-mm-dd',
		todayBtn: "linked",
		calendarWeeks: true,
		autoclose: true,
		pickerPosition: "bottom-left",
		weekStart: 1,
		startDate:new Date(t)
	});
});