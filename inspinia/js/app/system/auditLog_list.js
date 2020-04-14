$(document).ready(function() {
	var table = $('table#table').DataTable({
		scrollX : true,
		autoWidth : true,
		ajax : {
			url : baseUrl + '/datatable',
			data : function(d) {
				var username = $('.search-form').find('select[name="username"]').find("option:selected").text();
				var dateTime = $('.search-form').find('input[name="dateTime"]').val();
				d.username = username;
				d.dateTime = dateTime;
				return d;
			}
		},
		order : [ [ 2, 'asc' ] ],
		columns : [ {
			data : 'username'
		}, {
			data : 'operation',
			render : function(data, type, row, meta) {
				if (data == 'add') {
					return "新增";
				} else if (data == 'upd') {
					return "修改";
				} else {
					return "删除";
				}
			},
			defaultContent : ''
		}, {
			data : 'dateTime'
		}, {
			data : 'objClass',
		}, {
			data : 'data',
		} ]
	});

	$("#username").select2({
		ajax : {
			url : rootUrl + "/api/system/users",
			data : function(params) {
				params.q = params.term;
				return params;
			}
		}
	});

	$('#dateTime').daterangepicker({
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

	$('.search-form').on("submit", function(e) {
		table.draw();
		// 阻止表单submit
		return false;
	});

	$('#clear').on("click", function(e) {
		$("#username").val('').trigger("change");
		table.columns().search('').draw();
	});
})