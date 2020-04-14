$(document).ready(function () {
	/* form init validation */
	var form = $("#partSupplForm");

	// JQuery validate 插件看文档
	// form validation
	form.validate({
		rules : {
			supplId : {
				remote : {
					type : "GET",
					url : baseUrl + "/checkExists",
					data : {
						oldPartId : function() {
							return $("#oldPartId").val();
						},
						oldSupplId : function() {
							return $("#oldSupplId").val();
						},
						partId : function() {
							return $("#partId").val();
						},
						supplId : function() {
							return $("#supplId").val();
						}
					}
				}
			}
		},
		messages : {
			supplId : {
				remote : "零件供应商关系已存在!"
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
	$("#supplId").linkSelect2("plant", rootUrl + "/api/master/suppliers", "plant");
	// 包装下拉搜索
	$("#packId").linkSelect2("plant", rootUrl + "/api/master/packs", "plant");
	
});