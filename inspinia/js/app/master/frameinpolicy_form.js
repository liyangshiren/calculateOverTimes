$(document).ready(function() {
	$("#plant").select2({
		ajax : {
			url : rootUrl + "/api/master/plants"
		}
	});
	$("#warehouse").linkSelect2("plant", rootUrl + "/api/master/warehouses", "plant");
	$("#part").linkSelect2("plant", rootUrl + "/api/master/parts", "plant");
//    $("#dloc").linkSelect2("warehouse", rootUrl + "/api/master/dlocs", "warehouse");
    $("#loc").linkSelect2("warehouse", rootUrl + "/api/master/locs", "warehouse");
    
	
	// 根据规则的选择，切换目标库位/库区
//    $("#dloc").attr("disabled", true);
    $("#loc").attr("disabled", true);
	$("#ruleCode").on("change", function(e){
//		$("#dloc").attr("disabled", true);
		$("#loc").attr("disabled", true);
		// 3-动态库位策略类型（空库位、同料、同批次）
		if (this.value == "R01"){
//			$("#dloc").val(null).trigger("change");
			$("#loc").attr("disabled", false);
			return ;
		}
		$("#loc").val(null).trigger("change");
//		$("#dloc").attr("disabled", false);
	});
	$("#ruleCode").trigger("change");
	
	
	/* form init validation */
	var form = $("#frameInPolicyForm");

	form.validate({
		rules : {
			priority: {
		    	  number: true,
		    	  integerLength: 6,
		    	  digits: true,
		    	  min: 1
			},
			loc : {
				remote : {
					type : "GET",
					url : baseUrl + "/checkExists",
					data : {
						oldId : oldId,
						plantId : function() {
							return $("#plant").val();
						},
						partId : function() {
							return $("#part").val();
						},
						ruleCode : function() {
							return $("#ruleCode").val();
						},
						locId : function() {
							return $("#loc").val();
						},
						priority : function() {
							return $("#priority").val();
						}
					}
				}
			}
			/*,
			dloc : {
				remote : {
					type : "GET",
					url : baseUrl + "/checkExists",
					data : {
						oldId : oldId,
						plantId : function() {
							return $("#plant").val();
						},
						partId : function() {
							return $("#part").val();
						},
						ruleCode : function() {
							return $("#ruleCode").val();
						},
						dlocId : function() {
							return $("#dloc").val();
						},
						priority : function() {
							return $("#priority").val();
						}
					}
				}
			}*/
		},
		messages : {
			loc : {
				remote : "该上架策略配置已存在对应的工厂零件!"
			}
		/*,
			dloc : {
				remote : "该上架策略配置已存在对应的工厂零件!"
			}*/
		}
	});
});