$(document).ready(function() {
	var table = $('table#table').DataTable({
		ajax : {
			url : baseUrl + '/datatable',
			data : function(d) {
				var todealStatus = $('.search-form').find('select[name="todealStatus"]').val();
				var alterInfo = $('.search-form').find('input[name="alterInfo"]').val();
				var alertModule = $('.search-form').find('select[name="alertModule"]').val();
				var alterTime = $('.search-form').find('input[name="alterTime"]').val();
				d.todealStatus = todealStatus;
				d.alterInfo = alterInfo;
				d.alertModule = alertModule;
				d.alterTime = alterTime;
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
			data : 'alertApplication',
			name : 'alertApplication',
			render : function(data, type, row, meta) {
				if (data == '1') {
					return "接口";
				}
			},
			defaultContent : '',
		}, {
			data : 'alertModule',
			'class' : 'alertModule',
			defaultContent : ''
		}, {
			data : 'alterTime',
			name : 'alterTime',
			defaultContent : ''
		}, {
			data : 'alterPlace',
			name : 'alterPlace',
			'class' : 'text-center',
			defaultContent : ''
		}, {
			data : 'alterInfo',
			name : 'alterInfo',
			defaultContent : ''
		}, {
			data : 'alterLevel',
			name : 'alterLevel',
			defaultContent : ''
		}, {
			data : 'resolveYesno',
			name : 'resolveYesno',
			render : function(data, type, row, meta) {
				if (data) {
					return "已解决";
				} else {
					return "未解决"
				}
			},
			defaultContent : ''
		}, {
			data : 'resolvePersion',
			name : 'resolvePersion',
			defaultContent : ''
		}, {
			data : 'resolveTime',
			name : 'resolveTime',
			defaultContent : ''
		}, {
			data : 'todealStatus',
			name : 'todealStatus',
			render : function(data, type, row, meta) {
				if (data == '0') {
					return "需重处理";
				} else if (data == '1') {
					return "已处理";
				} else {
					return "无需重处理";
				}
			},
			defaultContent : ''
		}, {
			data : "",
			defaultContent : '',
			sortable : false,
			'class' : 'text-center',
			render : function(data, type, row, meta) {
				return ('<div class="btn-group"><a class="btn btn-default btn-xs redo" title="重处理" href="#"><i class="fa fa-refresh"></i></a>&nbsp;&nbsp;');
			}
		} ]
	});

	$('.search-form').on("submit", function(e) {
		var alertModule = $('.search-form').find('select[name="alertModule"]').val();
		table.column('alertModule:name').search(alertModule);
		e.preventDefault();
		table.draw();
		return false;
	});

	$('#clear').on("click", function(e) {
		$("#interfaceId").val('').trigger("change");
		table.columns().search('').draw();
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

	$('#alterTime').daterangepicker({
		format : 'YYYY-MM-DD HH:mm:ss',
		showDropdowns : true,
		showWeekNumbers : true,
		minDate : moment().add(-1, 'M'),
		maxDate : moment(),
		timePicker : true,
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
			'今天' : [ moment({hour: 0, minute: 0, second: 0}), moment({hour: 23, minute: 59, second: 59}) ],
			'昨天' : [ moment({hour: 0, minute: 0, second: 0}).subtract(1, 'days'), moment({hour: 23, minute: 59, second: 59}).subtract(1, 'days') ],
			'近7天' : [ moment({hour: 0, minute: 0, second: 0}).subtract(6, 'days'), moment({hour: 23, minute: 59, second: 59}) ],
			'近30天' : [ moment({hour: 0, minute: 0, second: 0}).subtract(29, 'days'), moment({hour: 23, minute: 59, second: 59}) ],
			'当月' : [ moment().startOf('month'), moment().endOf('month') ],
			'上月' : [ moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month') ]
		},
		startDate : moment().subtract(1, 'days'),
		endDate : moment()
	}, function(start, end) {
		$('#timeRange').val(start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));
	});
	
	$('#alterTime').val(moment({hour: 0, minute: 0, second: 0}).format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment({hour: 23, minute: 59, second: 59}).format('YYYY-MM-DD HH:mm:ss'));
	
	// 导出 动态组织form提交
	  $(".btn.export").on("click", function (e) {
		$("#exportForm .param").remove();
		var $frm = $("#exportForm");
	　　　var array = $('.search-form').serializeArray();
	　　　for (i = 0, length = array.length; i < length; i++) {
		　　　key = array[i].name;
			value = array[i].value;
			$frm.append($('<input class="param" type="hidden" name = "' + key + '" value = "' + value + '" />')); 
		}
		var params = table.ajax.params();
		$frm.append($('<input class="param" type="hidden" name="input" value = \'' + JSON.stringify(params) + '\' />')); 
		$frm.submit();
		// 阻止默认行为
		e.preventDefault();
		return false;  
	  });
})