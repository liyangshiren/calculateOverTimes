$(document).ready(function() {
	// $("#pack").hide();
	// $("#pack").attr("disabled", true);
	
	// form validation
	$("#receivePartForm").validate({
		rules : {
			part : {
				remote : baseUrl + "/check/part?oldPart=" + oldPart + "&receiveId=" + receiveId
			},
			requiredQty: {
                required: true,    //要求输入不能为空
                number: true,     //输入必须是数字
                min: 0           //输入的数字不能为负数
            },
            pQty: {
                required: true,    //要求输入不能为空
                number: true,     //输入必须是数字
                min: 1          //输入的数字不能为负数
            }
		},
		messages : {
			part : {
				remote : "该零件号已被使用!"
			},
			requiredQty: {
                required: "请输入数量",
                number: "请正确输入数字",
                min: "要货数量不能为负数"
            },
            pQty: {
                required: "请输入数量",
                number: "请正确输入数字",
                min: "包装数量大于等于1"
            }
		}
	});
	
	var requiredQtyValue = $(".requiredQtyCon")[0].defaultValue.split('.')[0];
	$(".requiredQtyCon")[0].defaultValue = requiredQtyValue;
	var pQtyValue = $(".pQtyCon")[0].defaultValue.split('.')[0];
	$(".pQtyCon")[0].defaultValue = pQtyValue;

	if(billType == '80'){
		// 零件的下拉
		partSelect();
		// 供应商的下拉
		supplSelect();
		$("#part").on("change", function() {
			$.ajax({
				async : false,
				url : rootUrl + "/master/part/getOne",
				data : {
					id : function() {
						return $("#part").val();
					}
				},
				success : function(data) {
					$("#unit").val(data['unit']);
					$("#unitTmp").val(data['unit']);
					if($("#suppl").val() != null && $("#suppl").val() != ''){
						$.ajax({
							async : false,
							url : rootUrl + "/master/partSuppl/getOne",
							data : {
								suppl : function() {
									return $("#suppl").val();
								},
								part : function() {
									return $("#part").val();
								}
							},
							success : function(data) {
								$("#pQty").val(data['packageQty']);
								$("#pack").val('')
								$("#packTmp").val('');
								if (null != data["pack"]) {
									$("#pack").val(data["pack"].id)
									$("#packTmp").val(data["pack"].no + "-" + data["pack"].name);
								}
							}
						});
					} else {
						$("#pQty").val('');
						$("#pack").val('')
						$("#packTmp").val('');
					}
					
				}
			});
			// 零件的下拉和改变 ——>供应商下拉的改变   只能查到和该零件绑定关系的供应商的数据
			supplSelect();
		});
		$("#suppl").on("change", function() {
			if($("#part").val() != null && $("#part").val() != ''){
				$.ajax({
					async : false,
					url : rootUrl + "/master/partSuppl/getOne",
					data : {
						suppl : function() {
							return $("#suppl").val();
						},
						part : function() {
							return $("#part").val();
						}
					},
					success : function(data) {
						$("#pQty").val(data['packageQty']);
						$("#pack").val('')
						$("#packTmp").val('');
						if (null != data["pack"]) {
							$("#pack").val(data["pack"].id)
							$("#packTmp").val(data["pack"].no + "-" + data["pack"].name);
						}
					}
				});
			}
			else {
				$("#pQty").val('');
				$("#pack").val('')
				$("#packTmp").val('');
			}
			// 供应商下拉的改变   ——> 零件下拉的改变     只能查到和该供应商绑定关系的零件
			partSelect();
		});
	}
	else{
		$("#part").select2({
			ajax : {
				url : rootUrl + "/api/master/partsBySuppl",
				data : function(params) {
					params.q = params.term;
					params.suppl = supplId;
					params.receive = receiveId;
					return params;
				},
			}
		});
		
		$("#part").on("change", function() {
			$.ajax({
				async : false,
				url : rootUrl + "/master/part/getOne",
				data : {
					id : function() {
						return $("#part").val();
					}
				},
				success : function(data) {
					$("#unit").val(data['unit']);
					$("#unitTmp").val(data['unit']);

					$.ajax({
						async : false,
						url : rootUrl + "/master/partSuppl/getOne",
						data : {
							suppl : supplId,
							part : function() {
								return $("#part").val();
							}
						},
						success : function(data) {
							$("#pQty").val(data['packageQty']);
							if (null != data["pack"]) {
								$("#pack").val(data["pack"].id)
								$("#packTmp").val(data["pack"].no + "-" + data["pack"].name);
							}
						}
					});
				}
			});
		});
	}
	
	
	if(billType == "80"){
		  $("#supplier").show();
	} else {
		  $("#supplier").hide();
	}

	function partSelect(){
		if($("#suppl").val() != null && $("#suppl").val() != ''){
			$("#part").select2({
				ajax : {
					url : rootUrl + "/api/master/partsBySuppl",
					data : function(params) {
						params.q = params.term;
						params.suppl = $("#suppl").val();
						return params;
					},
				}
			});
		}
		else {
			$("#part").select2({
				ajax : {
					url : rootUrl + "/api/master/parts"
				}
			});
		}
	}
	function supplSelect(){
		if($("#part").val() != null && $("#part").val() != ''){
			$("#suppl").select2({
				ajax : {
					url : rootUrl + "/api/master/supplByPart",
					data : function(params) {
						params.q = params.term;
						params.part = $("#part").val();
						return params;
					},
				}
			});
		} 
		else {
			$("#suppl").select2({
				ajax : {
					url : rootUrl + "/api/master/suppls"
				}
			});
		}
	}
	
});
