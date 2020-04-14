$(document).ready(function() {
	/* form init validation */
	var form = $("#partPackForm");

	// JQuery validate 插件看文档
	// form validation
	form.validate({
		rules : {
			partId : {
				remote : {
					type : "GET",
					url : baseUrl + "/checkExists",
					data : {
						oldPartId : function() {
							return $("#oldPartId").val();
						},
						partId : function() {
							return $("#partId").val();
						}
					}
				}
			},
			storageBin : {
				alnum : true,
				maxlength : 50
			},
			groupZone : {
				alnum : true,
				maxlength : 50
			}
		},
		messages : {
			partId : {
				remote : "零件包装关系已存在!"
			}
		}
	});

	// form.validate({
	// rules: {
	// //no: checkNo,
	// storageBin: {
	// alnum : true,
	// maxlength: 50
	// },
	// groupZone: {
	// alnum : true,
	// maxlength: 50
	// }
	// }
	// // messages: {
	// // no: {
	// // remote: "该零件编号在工厂下已被使用!"
	// // }
	// // }
	// });

	// 工厂下拉搜索
	$("#plant").select2({
		ajax : {
			url : rootUrl + "/api/master/plants",
		}
	});
	// 客户下拉搜索
	$("#customerId").select2({
		ajax : {
			url : rootUrl + "/api/master/customers",
		}
	});
	// 零件号下拉搜索
	$("#partId").linkSelect2("plant", rootUrl + "/api/master/parts", "plant");
	// 包装下拉搜索
	$("#packId").linkSelect2("plant", rootUrl + "/api/master/partpack", "plant");

});