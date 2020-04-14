$(document).ready(function() {
	var table = $('table#table').DataTable({
		ajax : {
			url : baseUrl + '/datatable',
			type : "POST",
			data : function(d) {
				var messageId = $('.search-form').find('input[name="messageId"]').val();
				var receiveStarts = $('.search-form').find('select[name="receiveStarts"]').val();
				d.messageId = messageId;
				d.receiveStarts = receiveStarts;
				d.config = config;
				return d;
			}
		},
		order : [[ 6, 'desc' ], [ 3, 'asc' ], [ 2, 'asc' ]],
		columns : [ {
			data : 'config.interfaceId',
			name : 'config.interfaceId',
			defaultContent : '',
		}, {
			data : 'config.interfaceDesc',
			name : 'config.interfaceDesc',
			defaultContent : ''
		}, {
			data : 'sequence',
			name : 'sequence',
			defaultContent : ''
		}, {
			data : 'receiveStarts',
			name : 'receiveStarts',
			render : function(data, type, row, meta) {
				if (data=="1") {
					return "接收成功";
				} else if(data=="2"){
					return "发送失败";
				} else if(data=="3"){
					return "发送成功";
				}else{
					return "接收失败";
				}
			},
			defaultContent : ''
		}, {
			data : 'feedbackStarts',
			name : 'feedbackStarts',
			render : function(data, type, row, meta) {
				if (data) {
					return "反馈成功";
				} else {
					return "反馈失败";
				}
			},
			defaultContent : ''
		}, {
			data : 'messageId',
			name : 'messageId',
			defaultContent : ''
		}, {
			data : 'createdDate',
			name : 'createdDate',
			defaultContent : ''
		}, {
			data : 'info',
			name : 'info',
			defaultContent : ''
		} ]
	});

	$('.search-form').on("submit", function(e) {
		e.preventDefault();
		table.draw();
		return false;
	});

	$("#interfaceId").select2({
		ajax : {
			url : rootUrl + "/api/system/interfaces",
			data : function(params) {
				params.q = params.term;
				return params;
			}
		}
	});

	$('table#table').on('dblclick', 'tr', function() {
		var row = table.row(this).data();
		var id = row.id
		if (id) {
			$.ajax({
				type : "POST",
				url : baseUrl + '/getMessage',
				dataType : 'text',
				data : {
					id : id
				},
				success : function(data) {
					if (data) {
						$(".modal-title").html(row.config.interfaceId + "-" + row.config.interfaceDesc + "数据")
						var status = row.receiveStarts;
						if (status=='1') {
							$("#modal-desc").html("顺序号: " + row.sequence + ", 状态: 接收成功!")
						} else if(status=='0'){
							$("#modal-desc").html("顺序号: " + row.sequence + ", 状态: 接收失败, 原因:" + row.info + ".")
						}else if(status=='2'){
							$("#modal-desc").html("顺序号: " + row.sequence + ", 状态: 发送失败, 原因:" + row.info + ".")
						}else {
							$("#modal-desc").html("顺序号: " + row.sequence + ", 状态: 发送成功, 原因:" + row.info + ".")
						}
						$('.summernote').html('<xmp>' + data + '</xmp>');
						$('#msgModal').modal('show');
					}
				}
			});
		}
	})
})