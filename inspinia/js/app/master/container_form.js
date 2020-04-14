$(document).ready(function() {
	/* form init validation */
	var form = $("#containerForm");
	form.validate({
		rules : {
			barcode : {
				remote : {
					type : "GET",
					url : baseUrl + "/checkExists",
					data : {
						
						oldLadBillNo : oldLadBillNo,
						ladBillNo : function() {
							return $("#ladBillNo").val();
						},
						oldSealNo : oldSealNo,
						sealNo : function() {
							return $("#sealNo").val();
						},
						oldBarcode : oldBarcode,
						barcode : function() {
							return $("#barcode").val();
						},
						id : function() {
							return $("#id").val();
						}
					}
				}
			}
		},
		messages : {
			barcode : {
				remote : "集装箱信息已存在!"
			}
		}
	});
	
	
	//工厂下拉搜索
	$("#plant").select2({
		ajax : {
			url : rootUrl + "/api/master/plants",
		}
	});
});