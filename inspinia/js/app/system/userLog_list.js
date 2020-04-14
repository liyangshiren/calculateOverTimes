$(document).ready(function() {
	var table = $('table#table').DataTable({
		ajax : {
			url : baseUrl + '/datatable',
			data : function(d) {
				var username = $('.search-form').find('select[name="username"]').find("option:selected").text();
				var logonTime = $('.search-form').find('input[name="logonTime"]').val();
				d.username = username;
				d.logonTime = logonTime;
				return d;
			}
		},
		order : [ [ 2, 'asc' ] ],
		columns : [ {
			data : 'username'
		}, {
			data : 'logonTime'
		}, {
			data : 'logoutTime'
		}, {
			data : 'remoteAddr', defaultContent:''
		}, {
			data : 'tryTimes',
		} ]
	});

	$("#username").select2({
		// placeholder : "输入员工姓名！",
		ajax : {
			url : rootUrl + "/api/system/users",
			data : function(params) {
				params.q = params.term;
				return params;
			}
		}
	});

	$('#logonTime').daterangepicker({
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