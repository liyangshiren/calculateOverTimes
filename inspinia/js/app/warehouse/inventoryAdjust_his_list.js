$(document).ready(
function() {
	
	$("#partNo").inputarea();
	$("#locNo").inputarea();
	$("#barcodeNo").inputarea();
	
	var table = $('table#table').DataTable({
		autoWidth:true,
		ajax : {
			url : baseUrl + '/datatable',
			type : "POST",
			data : function(d) {
				var times = $("#timeRange").val();
				d.times = times;
				d.partNo = $("#partNo").val();
				d.locNo = $("#locNo").val();
				d.barcodeNo = $("#barcodeNo").val();
				return d;
			}
		},
		order : [ [ 3, 'asc' ],[ 4, 'asc' ],[ 5, 'asc' ],[ 6, 'asc' ],[ 7, 'asc' ] ],
		columns : [
			{name : "plant",data : "plant.id", defaultContent:'', visible : false},
			{name : "warehouse",data : "warehouse.id", defaultContent:'', visible : false},
			{name : "loc",data : "loc.id", defaultContent:'',visible : false},
			{name : "part",data : "part.id", defaultContent:'',visible : false},
			{data : "plant.no", defaultContent:''},
			{data : "warehouse.no", defaultContent:''},
			{data : 'loc.no', defaultContent:'' },
			{name : 'partNo',data : 'part.no', defaultContent:'' },
			{name : 'partName',data : 'part.name', defaultContent:'' },
			{ data : 'barcode'},
			{ data : 'quantity' },
			{ data : 'lockQty' },
			{ data : 'onwayQty' },
			{ data : 'remark' },
			{ data : 'createdDate' }
	    ]
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
	
    $("#warehouse").select2({ 
	  ajax: { 
		url: rootUrl + "/api/master/warehouses"
	  }
    });
	
	$('.search-form').on("submit", function(e) {
		var wh = $('.search-form').find('select[name="warehouse"]').val();
		var partName = $('.search-form').find('input[name="partName"]').val();
		table.column('warehouse:name').search(wh);
		table.column('partName:name').search(partName);
		table.draw();
	    return false;
	});
});
