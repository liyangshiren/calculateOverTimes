$(document).ready(function() {
	var form = $("#tblForm");

	// 提交当前活动的form，多个tab时候需要知道当前的tab
	$(":submit", "#buttons").on("click", function(e) {
		form.submit();
	});

	// JQuery validate 插件看文档
	// form validation
	form.validate();
})