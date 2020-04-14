$(document).ready(function() {
			
			 $('.form_datetime').datetimepicker({
				  format: 'yyyy-mm-dd',
			      todayBtn: "linked",
			      minView: "month", //选择日期后，不会再跳转去选择时分秒
			      calendarWeeks: true,
			      autoclose: true,
			      pickerPosition: "bottom-left"
			  });

			$(".plant").select2({
				ajax : {
					url : rootUrl + "/api/master/plants",
				}
			});

			// 零件号下拉搜索
			$(".part").linkSelect2("plantId", rootUrl + "/api/master/parts", "plant");
//			 $(".part").linkSelect("plantId", rootUrl + "/api/master/parts",{addBlank:true});
			// 标签首打零件下拉搜索
//			$("#printForm").find(".part").linkSelect2WithControls(new Array($("#printForm").find("#plantId")),
//					rootUrl + "/api/master/parts", new Array("plant"));
			//标签补打零件号下拉
//			$("#reprintForm").find(".part").linkSelect2WithControls(new Array($("#reprintForm").find("#plantId"), $("#reprintForm").find("#seq")),
//					rootUrl + "/api/master/partsBySeq", new Array("plant", "seq"));

			// 供应商下拉搜索
			$("#printForm").find("#supplId").linkSelect2WithControls(new Array($("#printForm").find("#plantId"), $("#printForm").find("#partId")),
					rootUrl + "/api/master/suppliers", new Array("plant", "part"));

			var firstValue = $("#supplId option:first").val();
			$("#supplId").val(firstValue).trigger("change");

			// 供应商下拉搜索
			$("#reprintForm").find("#supplId").linkSelect2WithControls(new Array($("#reprintForm").find("#plantId"), $("#reprintForm").find("#partId")),
					rootUrl + "/api/master/suppliers", new Array("plant", "part"));

			// 包装下拉搜索
			$("#printForm").find("#packId").linkSelect2WithControls(new Array($("#printForm").find("#plantId"), $("#printForm").find("#supplId"), $("#printForm").find("#partId")),
					rootUrl + "/api/master/packs", new Array("plant", "suppl", "part"));

			$("#reprintForm").find("#packId").linkSelect2WithControls(
					new Array($("#printForm").find("#plantId"), $("#reprintForm").find("#supplId"), $("#reprintForm").find("#partId")), rootUrl + "/api/master/packs",
					new Array("plant", "suppl", "part"));

			// 填写包装容量和包装数量
			$(".pack").on("change", function() {
				var partId = $("#partId").val();
				var supplId = $("#supplId").val();
				if(partId && supplId){
					var packId = $(this).val();
					var position = $(this).attr("position")
					if (packId) {
						$.ajax({
							url : baseUrl + '/getPackageQty',
							type : 'POST',
							data : {
								packId : function() {
									return packId;
								},
								partId : function() {
									return partId;
								},
								supplId : function() {
									return supplId;
								}
							},
							success : function(data) {
								if (data) {
									$("#" + position).find("input#packQty").val(data);
								} else {
									$("#" + position).find("input#packQty").val("");
								}
							}
						});
					}
				}
			});
			
			// 定义一个失去焦点的javaScript函数标签号输入离开后触发
			$("#thrprintForm").find("#seq").blur(function(){
				var seq = $("#thrprintForm").find("#seq").val();
				var position = "thrprintForm";
				if (seq){
					$.ajax({
						url : baseUrl + '/getPartSupplData',
						type : 'POST',
						data : {
							seq : function() {
								return seq;
							}
						},
						success : function(data) {
							if (data && data.errMsg=='') {
								$("#" + position).find("input#plantId").val(data.part.plant.id);
								$("#" + position).find("input#partId").val(data.part.id);
								$("#" + position).find("input#supplId").val(data.suppl.id);
								$("#" + position).find("input#packId").val(data.pack.id);
								$("#" + position).find("input#plantNo").val(data.part.plant.no);
								$("#" + position).find("input#partNo").val(data.part.no);
								$("#" + position).find("input#supplNo").val(data.suppl.no);
								$("#" + position).find("input#packNo").val(data.pack.no);
								$("#" + position).find("input#mDate").val(data.mdate);
								$("#" + position).find("input#packQty").val(data.createdBy);//找个字符串的无需使用的字段放该值
								$("#" + position).find("input#plantNo").attr("disabled", "disabled");
								$("#" + position).find("input#partNo").attr("disabled", "disabled");
								$("#" + position).find("input#supplNo").attr("disabled", "disabled");
								$("#" + position).find("input#packNo").attr("disabled", "disabled");
							} else {
								bootbox.alert(data.errMsg);
								$("#" + position).find("input#plantId").val("");
								$("#" + position).find("input#partId").val("");
								$("#" + position).find("input#supplId").val("");
								$("#" + position).find("input#packId").val("");
								$("#" + position).find("input#plantNo").val("");
								$("#" + position).find("input#partNo").val("");
								$("#" + position).find("input#supplNo").val("");
								$("#" + position).find("input#packNo").val("");
								$("#" + position).find("input#packQty").val("");
								$("#" + position).find("input#mDate").val("");
							}
						}
					});
				}
			});

			var printForm = $("#printForm");

			printForm.validate({
				rules : {
					packQty : {
						number : true,
						integerLength : 6,
						digits : false,
						min : 1
					},
					printNum : {
						number : true,
						integerLength : 6,
						digits : false,
						min : 1
					}
				},
				messages : {}
			});

			var reprintForm = $("#reprintForm");

			reprintForm.validate({
				rules : {
					packQty : {
						number : true,
						integerLength : 6,
						digits : false,
						min : 1
					}
				},
				messages : {}
			});
			
			var thrprintForm = $("#thrprintForm");

			thrprintForm.validate({
				rules : {
					packQty : {
						number : true,
						integerLength : 6,
						digits : false,
						min : 1
					}
				},
				messages : {}
			});


			$("#serviceSubmit").click(function() {
				$("#printForm").removeAttr('target');
				$("#printForm").attr('action', baseUrl + '/print');
				$("#printForm").submit();
			});

			$("#reprintServiceSubmit").click(function() {
				$("#reprintForm").removeAttr('target');
				$("#reprintForm").attr('action', baseUrl + '/print');
				$("#reprintForm").submit();
			});
			$("#thrprintServiceSubmit").click(function() {
				$("#thrprintForm").removeAttr('target');
				$("#thrprintForm").attr('action', baseUrl + '/print');
				$("#thrprintForm").submit();
			});

			$("#localSubmit").click(function() {
				/**var num = Math.floor($("#printNum").val());
				if (num > 10) {
					bootbox.alert("直接打印份数不能超过10份！");
					return;
				}
				for (var i = 0; i < num; i++) {
					var tpw = window.open(baseUrl + '/local?i=' + i, 'tag-print-' + i);
					$("#printForm").attr('target', 'tag-print-' + i);
					$("#printForm").attr('action', baseUrl + '/localPrint?i=' + i);
					$("#printForm").submit();
				}**/

				$("#printForm").attr('target', '_blank');
		        $("#printForm").attr('action', baseUrl + '/localPrint');
		        $("#printForm").submit();
			});

			$("#reprintLocalSubmit").click(function() {
				$("#reprintForm").attr('target', '_blank');
				$("#reprintForm").attr('action', baseUrl + '/localPrint');
				$("#reprintForm").submit();
			});
			$("#thrprintLocalSubmit").click(function() {
				$("#thrprintForm").attr('target', '_blank');
				$("#thrprintForm").attr('action', baseUrl + '/localPrint');
				$("#thrprintForm").submit();
			});
		});