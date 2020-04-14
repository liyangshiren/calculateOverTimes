$(document).ready(function() {
	var table = $('table#table').DataTable($.extend({
		scrollX : true
	}, {
		ajax : {
			url : baseUrl + '/datatable',
			data : function(d) {
				var taskStatus = $('.search-form').find('select[name="taskStatus"]').val();
				d.templateName = templateName;
				d.condition = condition;
				d.taskStatus = taskStatus;
				return d;
			}
		},
		order : [ [ 3, 'desc' ] ],
		columns : [ {
			data : 'id',
			sortable : false,
			defaultContent : '',
			'class' : 'text-center',
			render : function(data, type, row, meta) {
				return '<div class="checkbox"><input type="checkbox" name="ids" value="' + data + '"/><label for="ids"/></div>'
			}
		}, {
			data : 'templateName',
			render : function(data, type, row, meta) {
				return VALUES_MAP_DICT_TYPE && VALUES_MAP_DICT_TYPE[data] ? VALUES_MAP_DICT_TYPE[data].text : '';
			},
			defaultContent : ''
		}, {
			data : 'sheetType',
			name : 'sheetType',
			defaultContent : ''
		}, {
			data : 'taskStatus',
			name : 'taskStatus',
			'class' : 'text-center',
			render : function(data, type, row, meta) {
				if (data == 0) {
					return "未处理";
				} else if (data == 1) {
					return "处理成功";
				} else {
					return "处理失败";
				}
			},
			defaultContent : ''
		}, {
			data : 'condition',
			name : 'condition',
			'class' : 'text-center',
			defaultContent : ''
		} ]
	}));

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
						$('.summernote').html('<xmp>' + data + '</xmp>');
						$('#msgModal').modal('show');
					}
				}
			});
		}
	});

	$(".btn.rePrint").on("click", function(e) {
		var ids = [];
		$('#table>tbody input:checked').each(function(i, item) {
			ids.push($(item).val());
		});
		$("#reprintForm #ids").val(ids.join(","));
		if (ids.length > 0) {
			bootbox.confirm("确定要重打印选中的数据吗?", function(result) {
				if (result) {
					$("#reprintForm").submit();
				}
			});
		} else {
			bootbox.alert("请选择要重打印的数据.");
		}
	});
})