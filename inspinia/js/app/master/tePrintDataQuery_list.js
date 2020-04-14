$(document).ready(function() {
	var table = $('table#table').DataTable({
		scrollX : true,
		ajax : {
			url : baseUrl + '/datatable',
			type : "POST",
			data : function(d) {
				var sheetType = $("#sheetType").val();
				var taskStatus = $("#taskStatus").val();
				var sheetNo = $("#sheetNo").val();
				var times = $("#timeRange").val();
				var condition = $("#condition").val();
				d.sheetType = sheetType;
				d.taskStatus = taskStatus;
				d.sheetNo = sheetNo;
				d.times = times;
				d.condition = condition;
				return d;
			}
		},
		order : [ [ 6, 'desc' ] ],
		columns : [ {
			data : 'id',
			sortable : false,
			defaultContent : '',
			'class' : 'text-center',
			render : function(data, type, row, meta) {
				return '<div class="checkbox"><input type="checkbox" name="ids" value="' + data + '"/><label for="ids"/></div>'
			}
		}, {
			data : 'sheetNo',
			'class' : 'text-center',
			name : 'sheetNo',
			defaultContent : ''
		}, {
			data : 'templateName',
			'class' : 'text-center',
			render : function(data, type, row, meta) {
				return VALUES_MAP_DICT_TYPE && VALUES_MAP_DICT_TYPE[data] ? VALUES_MAP_DICT_TYPE[data].text : '';
			},
			defaultContent : ''
		}, {
			data : 'sheetType',
			'class' : 'text-center',
			name : 'sheetType',
			defaultContent : ''
		}, {
			data : 'taskStatus',
			name : 'taskStatus',
			'class' : 'text-center',
			render : function(data, type, row, meta) {
				if (data == 0) {
					return "未打印";
				} else if (data == 1) {
					return "打印成功";
				} else {
					return "打印失败";
				}
			},
			defaultContent : ''
		}, {
			data : 'condition',
			'class' : 'text-center',
			name : 'condition',
			defaultContent : ''
		}, {
			data : 'createdDate',
			name : 'createdDate',
			'class' : 'text-center',
			defaultContent : ''
		}]
	});

	$('.search-form').on("submit", function(e) {
		var sheetType = $('.search-form').find('select[name="sheetType"]').val();
		var taskStatus = $('.search-form').find('select[name="taskStatus"]').val();
		var sheetNo = $('.search-form').find('input[name="sheetNo"]').val();
		var timeRange = $('.search-form').find('input[name="timeRange"]').val();
		if(!sheetType && !taskStatus && !sheetNo &&!timeRange){
			bootbox.alert("请选择查询条件进行查询.");
			return false;
		}
		table.column('sheetType:name').search(sheetType);
		table.column('taskStatus:name').search(taskStatus);
		table.column('sheetNo:name').search(sheetNo);
		table.draw();
		// 阻止表单submit
		return false;
	});
	
	$('#timeRange').daterangepicker({
		format : 'YYYY-MM-DD HH:mm:ss',
		showDropdowns : true,
		showWeekNumbers : true,
		timePicker : true,
		timePickerIncrement : 1,
		timePicker24Hour : true,
		opens : 'right',
		drops : 'down',
		locale: {
            applyLabel: '确认',
            cancelLabel: '取消',
            fromLabel : '起始时间',
            toLabel : '结束时间',
            customRangeLabel : '自定义',
            firstDay : 1
        },
		ranges : {
			'今天' : [ moment(), moment() ],
			'昨天' : [ moment().subtract(1, 'days'), moment().subtract(1, 'days') ],
			'近7天' : [ moment().subtract(6, 'days'), moment() ],
			'近30天' : [ moment().subtract(29, 'days'), moment() ],
			'当月' : [ moment().startOf('month'), moment().endOf('month') ],
			'上月' : [ moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month') ]
		},
		startDate : moment().subtract(1, 'days'),
		endDate : moment()
	}, function(start, end) {
		$('#timeRange').val(start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));
	});
	$('#timeRange').val(moment({hour: 0, minute: 0, second: 0}).subtract(6, 'days').format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment({hour: 23, minute: 59, second: 59}).format('YYYY-MM-DD HH:mm:ss'));

	table.on('click', '.redo', function() {
		var todealStatus = table.row($(this).parents('tr')).data().todealStatus;
		if (todealStatus != '0') {
			toastr.error("此记录无需重处理");
			return;
		}
		var id = table.row($(this).parents('tr')).data().id;
		$("#redoForm #ids").val(id);
		if (id) {
			bootbox.confirm("确定要重处理数据吗?", function(result) {
				if (result) {
					$("#redoForm").submit();
				}
			});
		}
	});

	$(".btn.redoAll").on("click", function(e) {
		var ids = [];
		$('#table>tbody input:checked').each(function(i, item) {
			ids.push($(item).val());
		});
		$("#redoForm #ids").val(ids.join(","));
		if (ids.length > 0) {
			bootbox.confirm("确定要重处理选中的数据吗?", function(result) {
				if (result) {
					$("#redoForm").submit();
				}
			});
		} else {
			bootbox.alert("请选择要重处理的数据.");
		}
	});

})