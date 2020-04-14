$(document).ready(function() {
	var table = $('table#table').DataTable({
		scrollX : true,
		autoWidth : true,
		ajax : {
			url : baseUrl + '/datatable',
			data : function(d) {
				var planNo = $('.search-form').find('input[name="planNo"]').val();
				var countWareHouse = $('.search-form').find('select[name="countWareHouse"]').val();
				var countType = $('.search-form').find('select[name="countType"]').val();
				var status = $('.search-form').find('select[name="status"]').val();
				var partNo = $('.search-form').find('select[name="partNo"]').val();
				var supplNo = $('.search-form').find('select[name="supplNo"]').val();
				var createdDate = $('.search-form').find('input[name="createdDate"]').val();
				var taskDate = $('.search-form').find('input[name="taskDate"]').val();
				d.planNo = planNo;
				d.countWareHouse = countWareHouse;
				d.countType = countType;
				d.status = status;
				d.partNo = partNo;
				d.supplNo = supplNo;
				d.createdDate = createdDate;
				d.taskDate = taskDate;
				return d;
			}
		},
		order : [ [ 10, 'desc' ]],
		columns : [ {
			data : 'id',
			sortable : false,
			defaultContent : '',
			'class' : 'text-center',
			render : function(data, type, row, meta) {
				return '<div class="checkbox"><input type="checkbox" name="ids" value="' + data + '" status="'+row.status+'"/><label for="ids"/></div>'
			}
		}, {
			name : "planNo",
			data : "planNo",
			defaultContent : ''
		}, {
			name : "countWareHouse.no",
			data : "countWareHouse.no",
			defaultContent : ''
		}, {
			name : "countType",
			data : "countType",
			render : function(data, type, row, meta) {
				return VALUES_MAP_DICT_TYPE_COUNT_TYPE && VALUES_MAP_DICT_TYPE_COUNT_TYPE[data] ? VALUES_MAP_DICT_TYPE_COUNT_TYPE[data].text : '';
			},
			defaultContent : ''
		}, {
			name : "status",
			data : "status",
			render : function(data, type, row, meta) {
				return VALUES_MAP_DICT_TYPE_COUNT_STATUS && VALUES_MAP_DICT_TYPE_COUNT_STATUS[data] ? VALUES_MAP_DICT_TYPE_COUNT_STATUS[data].text : '';
			},
			defaultContent : ''
		}, {
			name : "id",
			data : "id",
			render : function(data, type, row, meta) {
				return '<a class="btn btn-default btn-xs edit" title="计划详情" href="' + baseUrl + '/edit/' + row.id + '"><i class="fa fa-edit "></i>计划详情</a>'
			},
			defaultContent : ''
		}, {
			name : "id",
			data : "id",
			render : function(data, type, row, meta) {
				return '<a class="btn btn-default btn-xs" title="盘点任务清单" href="' + baseUrl + '/analysis/' + row.id + '"><i class="fa fa-list"></i></a>'
			},
			defaultContent : ''
		}, {
			name : "planStart",
			data : "planStart",
			defaultContent : ''
		}, {
			name : "planEnd",
			data : "planEnd",
			defaultContent : ''
		}, {
			name : "createdBy",
			data : "createdBy",
			defaultContent : ''
		}, {
			name : "createdDate",
			data : "createdDate",
			defaultContent : ''
		}, {
			name : "taskUser",
			data : "taskUser",
			defaultContent : ''
		}, {
			name : "taskDate",
			data : "taskDate",
			defaultContent : ''
		}, {
			name : "closeUser",
			data : "closeUser",
			defaultContent : ''
		}, {
			name : "closeDate",
			data : "closeDate",
			defaultContent : ''
		}, ]
	});

	$("#countWareHouse").select2({
		ajax : {
			url : rootUrl + "/api/master/warehouses",
			data : function(params) {
				params.q = params.term;
				return params;
			}
		}
	});

	$("#partNo").select2({
		ajax : {
			url : rootUrl + "/api/master/parts",
			data : function(params) {
				params.q = params.term;
				return params;
			}
		}
	});

	$("#supplNo").select2({
		ajax : {
			url : rootUrl + "/api/master/suppliers",
			data : function(params) {
				params.q = params.term;
				return params;
			}
		}
	});

	$('.datePicker').daterangepicker({
		format : 'YYYY-MM-DD HH:mm:ss',
		showDropdowns : true,
		showWeekNumbers : true,
		timePicker : true,
		minDate : moment().add(-3, 'M'),
		maxDate : moment(),
		timePickerIncrement : 1,
		timePicker24Hour : true,
		opens : 'right',
		drops : 'down',
		locale : {
			applyLabel : '确认',
			cancelLabel : '取消',
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

	$('#clear').on("click", function(e) {
		table.columns().search('').draw();
	});

	$('.search-form').on("submit", function(e) {
		var planNo = $('.search-form').find('input[name="planNo"]').val();
		table.column('planNo:name').search(planNo);
		table.draw();
		// 阻止表单submit
		return false;
	});

	$(".btn.diffReport").on("click", function(e) {
		var ids = [];
		$('#table>tbody input:checked').each(function(i, item) {
			ids.push($(item).val());
		});
		$("#exportForm #ids").val(ids.join(","));
		if (ids.length > 0) {
			bootbox.confirm("确定要导出选中的计划单盈亏吗?", function(result) {
				if (result) {
					$("#exportForm").submit();
				}
			});
		} else {
			bootbox.alert("请选择要导出的计划单.");
		}
	});
	
	$(".btn.closeCount").on("click", function(e) {
		var ids = [];
		var hasTwo = false;
		$('#table>tbody input:checked').each(function(i, item) {
			ids.push($(item).val());
			var status = $(item).attr("status");
			if (status == '2') {
				hasTwo = true;
			}
		});
		$("#closeForm #ids").val(ids.join(","));
		
		if (ids.length > 0) {
			if (hasTwo) {
				bootbox.confirm("存在已生成任务的盘点计划，确定都关闭？", function(result) {
					if (result) {
						$("#closeForm").submit();
					}
				});
			} else {
				bootbox.confirm("确定都关闭？", function(result) {
					if (result) {
						$("#closeForm").submit();
					}
				});
			}
		} else {
		      bootbox.alert("请选择要关闭的数据.");
	    }
	});

	$("#createDetailA").on("click", function(e) {
		var ids = [];
		$('#table>tbody input:checked').each(function(i, item) {
			ids.push($(item).val());
		});
		$("#createDetailForm #ids").val(ids.join(","));
		if (ids.length > 0) {
			bootbox.confirm("确定要生成盘点任务数据吗?", function(result) {
				if (result) {
					$("#createDetailForm").submit();
				}
			});
		} else {
		      bootbox.alert("请选择要生成盘点的数据.");
	    }
	});
})