$(document).ready(
function() {
	
	$("#partNo").inputarea();
	//$("#locNo").inputarea();
	$("#barcodeNo").inputarea();
	
	var table = $('table#table').DataTable({
		autoWidth:true,
		ajax : {
			url : baseUrl + '/inventoryLocDatatable',
			type : "POST",
			data : function(d) {
				var times = $("#timeRange").val();
				d.times = times;
				d.partNo = $("#partNo").val();
				//d.locNo = $("#locNo").val();
				d.barcodeNo = $("#barcodeNo").val();
				d.isDelete = 0;
				return d;
			}
		},
		order : [ [ 6, 'asc' ],[ 7, 'asc' ],[ 8, 'asc' ],[ 9, 'asc' ],[ 10, 'asc' ] ],
		columns : [
			{name : "warehouse",data : "warehouse.id", defaultContent:'', visible : false},
			{name : "dloc",data : "dloc.id", defaultContent:'',visible : false},
			{name : "loc",data : "loc.id", defaultContent:'',visible : false},
			{name : "suppl",data : "suppl.id", defaultContent:'',visible : false},
			{name : "part",data : "part.id", defaultContent:'',visible : false},
			{data : "warehouse.no", defaultContent:''},
			{data : 'dloc.no', defaultContent:'' },
			{data : 'loc.no', defaultContent:'' },
			{name : 'partNo',data : 'part.no', defaultContent:'' },
			{name : 'partName',data : 'part.name', defaultContent:'' },
			{data : 'suppl.no', defaultContent:'' },
			{ data : 'barcode'},
			{ data : 'batch', name : 'batch' },
			{ data : 'pack.no', defaultContent:'' },
			{ data : 'inStorageDate' },
			{ data : 'quantity' },
			{ data : 'lockQty' },
			{ data : 'onwayQty' },
			{
		      data: "",
		      defaultContent: '',
		      sortable: false,
		      'class': 'text-center',
		      render: function (data, type, row, meta) {
		        return ('<div class="btn-group">' +
		            '<a class="btn btn-default btn-xs" title="修改" href="' + baseUrl + '/adjust/' + row.id + '"><i class="fa fa-edit"></i></a>' +
		            '</div>' +
		            '&nbsp;&nbsp;');
		      }
		    }]
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
    $("#warehouse").select2({ 
	  ajax: { 
		url: rootUrl + "/api/master/warehouses"
	  }
    });
    $("#suppl").select2({
      ajax: { 
        url: rootUrl + "/api/master/suppls"
      }
    });
    $("#dloc").linkSelect2("warehouse", rootUrl + "/api/master/dlocs", "warehouse");
    $("#loc").linkSelect2("dloc", rootUrl + "/api/master/locs", "dloc");
	
	$('.search-form').on("submit", function(e) {
		var wh = $('.search-form').find('select[name="warehouse"]').val();
		var dloc = $('.search-form').find('select[name="dloc"]').val();
		var loc = $('.search-form').find('select[name="loc"]').val();
		var suppl = $('.search-form').find('select[name="suppl"]').val();
		var partNo = $('.search-form').find('input[name="partNo"]').val();
		var partName = $('.search-form').find('input[name="partName"]').val();
		var partState = $('.search-form').find('select[name="partState"]').val();
		var batch = $('.search-form').find('input[name="batch"]').val();
		var barcode = $('.search-form').find('input[name="barcodeNo"]').val();
		var timeRange = $("#timeRange").val();
		 if(!wh && !dloc && !loc && !suppl && !partNo 
				  && !partName && !partState && !batch && !barcode && !timeRange ){
			  bootbox.alert("请选择查询条件进行查询");
			  return false;
		  }
		
		table.column('warehouse:name').search(wh);
		table.column('dloc:name').search(dloc);
		table.column('loc:name').search(loc);
		table.column('suppl:name').search(suppl);
		//table.column('partNo:name').search(partNo);
		table.column('partName:name').search(partName);
		table.column('partState:name').search(partState);
		table.column('batch:name').search(batch);
		//table.column('barcode:name').search(barcode);
		table.draw();
		// 阻止表单submit
		return false;
	});
});
