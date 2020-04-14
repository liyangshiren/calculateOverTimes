$(document).ready(function() {
	var form = $("#tblForm");

	// 提交当前活动的form，多个tab时候需要知道当前的tab
	$(":submit", "#buttons").on("click", function(e) {
		form.submit();
	});

	form.validate({
		rules : {
			copies : {
				min : 1
			},
			runInterval : {
				min : 20
			}
		},
		messages : {
			copies : {
				min : "拷贝份数最少1份"
			},
			runInterval : {
				min : "两次打印间运行间隔最少20秒"
			}
		}
	});
})