$(document).ready(function() {
	
	$('#clear').on("click", function (e) {
		$(".plant").text("请选择");
		$("#printForm").find("#length").text("请选择");
		$("#printForm").find("#width").text("请选择");
		$("#printForm").find("#height").text("请选择");
		$("#printForm").find("#packId").text("请选择");
    });
			
			$(".plant").select2({
				ajax : {
					url : rootUrl + "/api/master/plants",
				}
			});
			// 包装箱号打印，包装下拉搜索
			$("#printForm").find("#packId").linkSelect2WithControls(new Array($("#printForm").find("#plantId"), $("#printForm").find("#supplId"), $("#printForm").find("#partId")),
					rootUrl + "/api/master/pack", new Array("plant", "suppl", "part"));
			
			// 长  下拉
			$("#printForm").find("#length").linkSelect2("plant", rootUrl + "/api/master/lengths", "plant");
			// 宽  下拉
			$("#printForm").find("#width").linkSelect2("plant", rootUrl + "/api/master/widths", "plant");
			// 高 下拉
			$("#printForm").find("#height").linkSelect2("plant", rootUrl + "/api/master/heights", "plant");
			
			// 定义一个失去焦点的javaScript函数标签号输入离开后触发
			$("#reprintForm").find("#seq").blur(function(){
				var seq = $("#reprintForm").find("#seq").val();
				var position = "reprintForm";
				if (seq){
					$.ajax({
						url : baseUrl + '/fingByLeveltwoMu',
						type : 'POST',
						data : {
							seq : function() {
								return seq;
							}
						},
						success : function(data) {
							if (data && data.errMsg=='') {
								$("#" + position).find("input#plantId").val(data.plant.id);
								$("#" + position).find("input#packId").val(data.id);
								$("#" + position).find("input#plantNo").val(data.plant.no);
								$("#" + position).find("input#packageNo").val(data.no);
								$("#" + position).find("input#length").val(data.length);
								$("#" + position).find("input#width").val(data.width);
								$("#" + position).find("input#height").val(data.height);
								$("#" + position).find("input#plantNo").attr("disabled", "disabled");
								$("#" + position).find("input#packageNo").attr("disabled", "disabled");
								$("#" + position).find("input#length").attr("disabled", "disabled");
								$("#" + position).find("input#width").attr("disabled", "disabled");
								$("#" + position).find("input#height").attr("disabled", "disabled");
							} else {
								bootbox.alert(data.errMsg);
								$("#" + position).find("input#plantId").val("");
								$("#" + position).find("input#packId").val("");
								$("#" + position).find("input#plantNo").val("");
								$("#" + position).find("input#packageNo").val("");
								$("#" + position).find("input#length").val("");
								$("#" + position).find("input#width").val("");
								$("#" + position).find("input#height").val("");
							}
						}
					});
				}
			});
			
			
			var printForm = $("#printForm");
			printForm.validate({
				rules : {
					printNum : {
						required: true,    //要求输入不能为空
		                number: true,     //输入必须是数字
		                min: 1,          //输入的数字不能为0或者负数
		                digits:true		//必须是整数
					}
				},
				messages : {
					printNum: {
		                required: "请输入数量",
		                number: "请正确输入数字",
		                min: "不能小于1",
		                digits: "必须是整数"
		            }
				}
			});

			$("#serviceSubmit").click(function() {
				/*$("#printForm").removeAttr('target');
				$("#printForm").attr('action', rootUrl + '/wms/packagePrint/Print');*/
				$("#printForm").attr('target', '_blank');
		        $("#printForm").attr('action', rootUrl + '/wms/packagePrint/localPrint');
				$("#printForm").submit();
			});
			$("#reprintServiceSubmit").click(function() {
				$("#reprintForm").attr('target', '_blank');
		        $("#reprintForm").attr('action', rootUrl + '/wms/packagePrint/localPrint');
				$("#reprintForm").submit();
			});

			$("#localSubmit").click(function() {
				$("#printForm").attr('target', '_blank');
		        $("#printForm").attr('action', rootUrl + '/wms/packagePrint/localPrint');
		        $("#printForm").submit();
			});
			$("#reprintLocalSubmit").click(function() {
				$("#reprintForm").attr('target', '_blank');
		        $("#reprintForm").attr('action', rootUrl + '/wms/packagePrint/localPrint');
		        $("#reprintForm").submit();
			});
			
			// 宽的改变事件
			$("#width").on("change", function() {
				// 长的下拉
				$("#length").select2({
					ajax : {
						url : rootUrl + "/api/master/lengths",
						data : function(params) {
							params.q = params.term;
							if($("#width").val() != null && $("#width").val() != ""){
								params.width = $("#width").val();
							}
							if($("#height").val() != null && $("#height").val() != ""){
								params.height = $("#height").val();
							}
							if($("#packId").val() != null && $("#packId").val() != ""){
								params.packId = $("#packId").val();
							}
							return params;
						}
					}
				});
				// 高的下拉
				$("#height").select2({
					ajax : {
						url : rootUrl + "/api/master/heights",
						data : function(params) {
							params.q = params.term;
							if($("#length").val() != null && $("#length").val() != ""){
								params.length = $("#length").val();
							}
							if($("#width").val() != null && $("#width").val() != ""){
								params.width = $("#width").val();
							}
							if($("#packId").val() != null && $("#packId").val() != ""){
								params.packId = $("#packId").val();
							}
							return params;
						}
					}
				});
				selectPackageNo();
			});		
			
			// 长的改变事件
			$("#length").on("change", function() {
				// 宽的下拉
				$("#width").select2({
					ajax : {
						url : rootUrl + "/api/master/widths",
						data : function(params) {
							params.q = params.term;
							if($("#length").val() != null && $("#length").val() != ""){
								params.length = $("#length").val();
							}
							if($("#height").val() != null && $("#height").val() != ""){
								params.height = $("#height").val();
							}
							if($("#packId").val() != null && $("#packId").val() != ""){
								params.packId = $("#packId").val();
							}
							return params;
						}
					}
				});
				// 高的下拉
				$("#height").select2({
					ajax : {
						url : rootUrl + "/api/master/heights",
						data : function(params) {
							params.q = params.term;
							if($("#length").val() != null && $("#length").val() != ""){
								params.length = $("#length").val();
							}
							if($("#width").val() != null && $("#width").val() != ""){
								params.width = $("#width").val();
							}
							if($("#packId").val() != null && $("#packId").val() != ""){
								params.packId = $("#packId").val();
							}
							return params;
						}
					}
				});
				selectPackageNo();
			});
			
			// 高的改变事件
			$("#height").on("change", function() {
				// 宽的下拉
				$("#width").select2({
					ajax : {
						url : rootUrl + "/api/master/widths",
						data : function(params) {
							params.q = params.term;
							if($("#length").val() != null && $("#length").val() != ""){
								params.length = $("#length").val();
							}
							if($("#height").val() != null && $("#height").val() != ""){
								params.height = $("#height").val();
							}
							if($("#packId").val() != null && $("#packId").val() != ""){
								params.packId = $("#packId").val();
							}
							return params;
						}
					}
				});
				// 长的下拉
				$("#length").select2({
					ajax : {
						url : rootUrl + "/api/master/lengths",
						data : function(params) {
							params.q = params.term;
							if($("#height").val() != null && $("#height").val() != ""){
								params.height = $("#height").val();
							}
							if($("#width").val() != null && $("#width").val() != ""){
								params.width = $("#width").val();
							}
							if($("#packId").val() != null && $("#packId").val() != ""){
								params.packId = $("#packId").val();
							}
							return params;
						}
					}
				});
				selectPackageNo();
			});
			
			// 包装编号的改变
			$("#packId").on("change", function() {
				$.ajax({
					async : false,
					url : rootUrl + "/master/pack/getOne",
					data : {
						packId : function() {
							return $("#packId").val();
						}
					},
					success : function(data) {
						// 高的下拉
						$("#height").select2({
							ajax : {
								url : rootUrl + "/api/master/heights",
								data : function(params) {
									params.q = params.term;
									if($("#packId").val() != null && $("#packId").val() != ""){
										params.packId = $("#packId").val();
									}
									return params;
								}
							}
						});
						// 长的下拉
						$("#length").select2({
							ajax : {
								url : rootUrl + "/api/master/lengths",
								data : function(params) {
									params.q = params.term;
									if($("#packId").val() != null && $("#packId").val() != ""){
										params.packId = $("#packId").val();
									}
									return params;
								}
							}
						});
						// 宽的下拉
						$("#width").select2({
							ajax : {
								url : rootUrl + "/api/master/widths",
								data : function(params) {
									params.q = params.term;
									if($("#packId").val() != null && $("#packId").val() != ""){
										params.packId = $("#packId").val();
									}
									return params;
								}
							}
						});
					}
				});
			});

			// 包装编号的下拉
			function selectPackageNo (){
				// 包装的下拉
				$("#packId").select2({
					ajax : {
						url : rootUrl + "/api/master/pack",
						data : function(params) {
							params.q = params.term;
							if($("#plantId").val() != null && $("#plantId").val() != ""){
								params.plant = $("#plantId").val();
							}
							if($("#length").val() != null && $("#length").val() != ""){
								params.length = $("#length").val();
							}
							if($("#width").val() != null && $("#width").val() != ""){
								params.width = $("#width").val();
							}
							if($("#height").val() != null && $("#height").val() != ""){
								params.height = $("#height").val();
							}
							return params;
						}
					}
				});
			}
			
});