$(document).ready(function() {
	var table = $('table#table').DataTable({
		scrollX : true,
		autoWidth : true,
		ajax : {
			url : baseUrl + '/datatable',
			data : function(d) {
				var plant = $('.search-form').find('select[name="plant"]').find("option:selected").text();
				var warehouse = $('.search-form').find('select[name="warehouse"]').find("option:selected").text();
				var locNo = $('.search-form').find('input[name="loc"]').val();
				var part = $('.search-form').find('input[name="part"]').val();
				var souBarcode = $('.search-form').find('input[name="souBarcode"]').val();
				var desBarcode = $('.search-form').find('input[name="desBarcode"]').val();
				var createdDateRange = $("#createdDateRange").val();
				console.log(plant.split(" ")[0])
				console.log(warehouse.split("-")[0])
				console.log(locNo)
				console.log(part)
				console.log(souBarcode)
				console.log(desBarcode)
				console.log(createdDateRange)
				d.plantNo = plant.split(" ")[0];
				d.warehouseNo = warehouse.split("-")[0];
				d.loc = locNo;
				d.part = part;	
				d.souBarcode = souBarcode;
				d.desBarcode = desBarcode;
				d.createdDateRange = createdDateRange;
				return d;
			}
		},
		order : [ [ 8, 'desc' ] ],
		columns : [ {
			data : 'plantNo'
		}, {
			data : 'warehouseNo'
		}, {
			data : 'locNo',
		}, {
			data : 'partNo',
		}, {
			data : 'souBarcode',
		} , {
			data : 'desBarcode',
		} , {
			data : 'quantity',
		} , {
			data : 'createdBy',
		} , {
			data : 'createdDate',
		}  ]
	});
	
	  $('#createdDateRange').daterangepicker({
			format: 'YYYY-MM-DD HH:mm:ss',
		    showDropdowns: true,
		    showWeekNumbers: true,
		    timePicker: true,
		    timePickerIncrement: 1,
		    timePicker24Hour: true,
		    opens: 'right',
		    drops: 'down',
			locale: {
		        applyLabel: '确认',
		        cancelLabel: '取消',
		        fromLabel : '起始时间',
		        toLabel : '结束时间',
		        customRangeLabel : '自定义',
		        firstDay : 1
		    },
		    ranges: {
		      '今天': [moment(), moment()],
		      '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
		      '近7天': [moment().subtract(6, 'days'), moment()],
		      '近30天': [moment().subtract(29, 'days'), moment()],
		      '当月': [moment().startOf('month'), moment().endOf('month')],
		      '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		    },
		    startDate: moment().subtract(1, 'days'),
		    endDate: moment()
		  }, function (start, end) {
		    $('#createdDateRange').val(start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));
		  });

	$("#plant").select2({ajax : {url : rootUrl + "/api/master/plants"}});

	$("#warehouse").select2({ajax : {url : rootUrl + "/api/master/warehouses"}});

	$('.search-form').on("submit", function(e) {
		e.preventDefault();
		table.draw();
		// 阻止表单submit
		return false;
	});
	
	$("#souBarcode").inputarea();
	$("#desBarcode").inputarea();
	$("#loc").inputarea();
	$("#part").inputarea();
});
