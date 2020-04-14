$(document).ready(function () {
	/* form init validation */
	var form = $("#frameInPolicyDetailForm");

	// 提交当前活动的form，多个tab时候需要知道当前的tab
	$(":submit", "#buttons").on("click", function (e) {
		form.submit();
	});
	// form validation
	form.validate({
		rules: {
			value: {
				remote: {
					// url: baseUrl + "/check/value?frameInStrategy=" + frameInStrategy,
				    url: baseUrl + "/check/value",
				    data: {
				    	frameInStrategy: frameInStrategy,
				    	detailType: function() {
				    		return $("#type").val();
				    	}
				    }
				}
			}
		},
		messages: {
			value: {
				remote: "该库位(或库区)不存在!"
			}
		}
	});
	
	// 根据明细类型，切换文本框输入或下拉框
	$("#textValue").hide();
	$("#textValue").attr("disabled", true);
	$("#selectValue").hide();
	$("#selectValue").attr("disabled", true);
	
	$("#type").on("change", function(e){
		$("#textValue").hide();
		$("#textValue").attr("disabled", true);
		$("#selectValue").hide();
		$("#selectValue").attr("disabled", true);
		// 3-动态库位策略类型（空库位、同料、同批次）
		if (this.value == 3){
			$("#selectValue").show();
			$("#selectValue").attr("disabled", false);
			return ;
		}
		$("#textValue").show();
		$("#textValue").attr("disabled", false);
		
	});
});