$(document).ready(function () {
  var table = $('table#table').DataTable({
	scrollX: true,
	autoWidth: true,
    ajax: {
    	url : baseUrl + '/datatable',
		data : function(d) {
			var opTime = $("#opTime").val();
			d.opTime = opTime;
			return d;
		}
    },
    order: [
      [4, 'desc']
    ],
    columns: [
    {
        data: 'opType',
        name: 'opType',
        defaultContent: '',
        render: function (data, type, row, meta) {
          return VALUES_MAP_OP_TYPE && VALUES_MAP_OP_TYPE[data] ? VALUES_MAP_OP_TYPE[data].text : '';
        }
    },
    {
        data: 'alertType',
        name: 'alertType',
        defaultContent: '',
        render: function (data, type, row, meta) {
          return VALUES_MAP_ALERT_TYPE && VALUES_MAP_ALERT_TYPE[data] ? VALUES_MAP_ALERT_TYPE[data].text : '';
        }
    },
    {name: 'sheetNo', data: "sheetNo", defaultContent: ''}, 
    {name: 'partNo', data: "partNo", defaultContent: ''}, 
    {name: 'opTime', data: "opTime", defaultContent: ''}, 
    {name: 'createdBy', data: "createdBy", defaultContent: ''}, 
    {name: 'auditor', data: "auditor", defaultContent: ''}, 
    {name: 'auditorTime', data: "auditorTime", defaultContent: ''}, 
    ]
  });
  
  $('#opTime').daterangepicker({
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
		$('#opTime').val(start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));
	});
  
  $('.search-form').on("submit", function(e) {
    var opType = $("#opType").val();
    var alertType = $("#alertType").val();
    var sheetNo = $("#sheetNo").val();
    var partNo = $("#partNo").val();
    var createdBy = $("#createdBy").val();
    var auditor = $("#auditor").val();
    
    table.column('opType:name').search(opType);
    table.column('alertType:name').search(alertType);
    table.column('sheetNo:name').search(sheetNo);
    table.column('partNo:name').search(partNo);
    table.column('createdBy:name').search(createdBy);
    table.column('auditor:name').search(auditor);
    table.draw();
    return false;
  });
});
