$(document).ready(function () {
	/* form init validation */
	var form = $("#inventoryLocForm");

	// 提交当前活动的form，多个tab时候需要知道当前的tab
	$(":submit", "#buttons").on("click", function (e) {
		form.submit();
	});
    var startDate = $('#inStorageDate').datetimepicker({
        format: "yyyy-mm-dd hh:mm:ss",
        language: 'cn',
        weekStart: 1,
        autoclose: false,
        todayBtn: 'linked'
      }).on('changeDate', function (ev) {
      });
	// JQuery validate 插件看文档
	// form validation
	form.validate({
		rules: {
			partName: {
				// check username's existence
				remote: "/warehouse/inventoryLoc/check/partName?oldName=" + oldName
			}
		},
		messages: {
			partName: {
				remote: "名称已经被使用!"
			}
		}
	});
});