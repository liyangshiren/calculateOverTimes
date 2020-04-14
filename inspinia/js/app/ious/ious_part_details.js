/**
 * 白条关联收货
 * by xiaowei
 */

$(document).ready(function() {
	
	// form validation
	$("#associateForm").validate();
	
	$('#associateModal').modal({
		keyboard : true, // 当按下 escape 键时关闭模态框，设置为 false 时则按键无效
		show : false // 当初始化时不显示模态框
	}).on("show.bs.modal", function(e) {
		// 触发模态框的同时调用此方法填值
		// 这里的btn就是触发元素，即你点击的删除按钮
		var btn = $(e.relatedTarget), id = btn.data('id');
		var tr = $("#"+id);
		
		var pusNo = tr.children("td[name='sdsNo']").text();
		var requiredQty = tr.children("td[name='requiredQty']").text();
		var receiveQty = tr.children("td[name='receiveQty']").text();
		
		$("#pusNo").text(pusNo);
		$("#requiredQty").text(requiredQty);
		$("#receiveQty").text(receiveQty);
		$("#pusPartId").val(id);
		
		// 可输入的数据
		var iousCanAssociateQty = $("#iousReceiveQty").val() - $("#associateQty").val();
		var pusCanAssociateQty = requiredQty - receiveQty;
		var associateQty = iousCanAssociateQty > pusCanAssociateQty ? pusCanAssociateQty : iousCanAssociateQty;
		$("#quantity").attr('max', associateQty)
		$("#quantity").val('').focus();
		
	});
	
	$('#submit').on("click", function(e) {
		$("#associateForm").submit();
	});
	
});