$(document).ready(function() {
	/* form init validation */
	var form = $("#containerReport");
	form.validate({
		rules : {
			barcode : {
				remote : {
					type : "GET",
					url : baseUrl + "/checkCustomerNo",
					data : {
						oldBarcode : oldBarcode,
						barcode : function() {
							return $("#barcode").val();
						},
						oldCustomsdeclNumber : oldCustomsdeclNumber,
						customsdeclNumber : function() {
							return $("#customsdeclNumber").val();
						},
					}
				}
			}
		},
		messages : {
			barcode : {
				remote : "集装箱号和报关号关系已存在!"
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