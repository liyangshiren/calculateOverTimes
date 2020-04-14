$(document).ready(function() {

	$("#souBarcode").focus();

	var printForm = $("#printForm");

	var validate = printForm.validate({
		rules : {
			souBarcode : {
				remote : {
					url : baseUrl + "/check/souBarcode",
					type : "get",
					dataType : 'text',
					data : {
						souBarcode : function() {
							return $("#souBarcode").val();
						}
					},
					dataFilter : function(data) {
						if (data) {
							var json = JSON.parse(data);
							if (json.length < 1) {
								$("#souBarcode").focus();
								return false;
							} else {
								var vo = json[0]
								$("#plantNo").val(vo.plantNo + "--" + vo.plantName);
								$("#partNo").val(vo.partNo + "--" + vo.partName);
								$("#supplNo").val(vo.supplNo + "--" + vo.supplName);
								$("#packNo").val(vo.packNo);
								$("#packQty").val(vo.packQty);
								$("#productDate").val(vo.productDate);
								$("#souBarcode").focus();
								return true;
							}
						}
					}
				}
			},
			packNo : {
				remote : {
					type : "GET",
					url : baseUrl + "/check/package",
					data : {
						plantNo : function() {
							return $("#plantNo").val();
						}
					}
				}
			},
			packQty : {
				number : true,
				integerLength : 6,
				digits : false,
				min : 1
			},
			seq : {
				number : true,
				integerLength : 6,
				digits : true,
				min : 1
			}
		},
		messages : {
			souBarcode : {
				remote : "源标签不存在!"
			},
			packNo : {
				remote : "包装编号不存在!"
			}
		}
	});

	$("#localSubmit").click(function() {
		if (validate.form()) {
			$("#printForm").attr('target', '_blank');
			$("#printForm").attr('action', baseUrl + '/localRePgkPrint');
			$("#printForm").submit();
		}
	});

	$('#productDate').datetimepicker({
		format : 'yyyy-mm-dd',
		minView : "month",
		todayBtn : "linked",
		calendarWeeks : true,
		autoclose : true,
		pickerPosition : "bottom-left"
	});

	// 回车触发表单验证
	$("#souBarcode").keyup(function(event) {
		if (event.keyCode == 13) {
			  $.ajax({
			    	url: baseUrl + '/check/souBarcode',
			    	data : {
			    		souBarcode : function() {
							return $("#souBarcode").val();
						}
			    	},
			    	type: 'get',
			    	dataType : 'text',
			    	success: function(data){
			    		if(data){
			    			var json = JSON.parse(data);
							if (json.length < 1) {
								$("#souBarcode").focus();
								return false;
							} else {
								var vo = json[0]
								$("#plantNo").val(vo.plantNo + "--" + vo.plantName);
								$("#partNo").val(vo.partNo + "--" + vo.partName);
								$("#supplNo").val(vo.supplNo + "--" + vo.supplName);
								$("#packNo").val(vo.packNo);
								$("#packQty").val(vo.packQty);
								$("#productDate").val(vo.productDate);
								$("#souBarcode").focus();
								return true;
							}
			    		}
			    	} 
			    });
		}
	})
});