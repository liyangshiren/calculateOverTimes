$(document).ready(function () {
	$("#quantity").bind("input propertychange", function() {
		var oldQuantity = parseFloat($("#oldQuantity").val()) || 0;
		var quantity = parseFloat($("#quantity").val());
	    $("#countQuantity").val(quantity + oldQuantity);
	    $("#messageDiv").html("");
	});
	
	$("#lockQty").bind("input propertychange", function() {
		var oldLockQty = parseFloat($("#oldLockQty").val()) || 0;
		var lockQty = parseFloat($("#lockQty").val());
	    $("#countLockQty").val(lockQty + oldLockQty);
	    $("#messageDiv").html("");
	});
	
	$("#onwayQty").bind("input propertychange", function() {
		var oldOnwayQty = parseFloat($("#oldOnwayQty").val()) || 0;
		var onwayQty = parseFloat($("#onwayQty").val());
	    $("#countOnwayQty").val(onwayQty + oldOnwayQty);
	    $("#messageDiv").html("");
	});
	
	$("#adjustInventoryLocButton").click(function(){
		var quantity = parseFloat($("#quantity").val()) || 0;
		var lockQty = parseFloat($("#lockQty").val()) || 0;
		var onwayQty = parseFloat($("#onwayQty").val()) || 0;
		
		if(quantity == 0 && lockQty == 0 && onwayQty == 0) {
			 $("#messageDiv").html("库存数量、锁定数量、在途数量至少调整一项");
			 return;
		}
		
		$.ajax({
			type: 'POST',
			url: baseUrl + '/saveAdjust',
			data: {
				id:id,
				quantity:quantity,
				lockQty:lockQty,
				onwayQty:onwayQty,
				remark:$("#remark").val()
			},
			success: function(r){
				if(r == "succes") {
					$("#oldQuantity").val($("#countQuantity").val());
					$("#oldLockQty").val($("#countLockQty").val());
					$("#oldOnwayQty").val($("#countOnwayQty").val());
					$("#messageDiv").html("操作成功");
					$("#quantity").val("");
					$("#lockQty").val("");
					$("#onwayQty").val("");
					$("#remark").val("");
					return;
				}
				$("#messageDiv").html(r);
			},
			error:function(){
				$("#messageDiv").html("操作失败");
			}
		});
	});
});