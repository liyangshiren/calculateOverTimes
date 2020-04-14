$(document).ready(function () {

	$("#inventoryAdjustForm").validate({
		rules: {
			freezeReason: {
				required: true,    //要求输入不能为空
			}
		},
		messages: {
			freezeReason: {
				required: "请输入冻结原因",
			}
		}
	});

	$("#adjustInventoryLocButton").click(function(){
		$.ajax({
			type: 'POST',
			url: baseUrl + '/saveFreeze',
			data: {
				id:id,
				freezeReason:$("#freezeReason").val()
			},
			success: function(r){
				if(r == "success") {
					$("#messageDiv").html("操作成功");
					window.location.href=baseUrl
				}
				$("#messageDiv").html(r);
			},
			error:function(){
				$("#messageDiv").html("操作失败");
			}
		});
	});
});