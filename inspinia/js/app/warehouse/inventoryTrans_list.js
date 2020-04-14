$(document).ready(function() {
	var table = $('table#table').DataTable({
		scrollX : true,
		autoWidth : true,
		ajax : {
			url : baseUrl + '/datatable',
			data : function(d) {
				var plant = $('.search-form').find('select[name="plant"]').val();
				var partId = $('.search-form').find('select[name="partId"]').val();
				var fromWarehouse = $('.search-form').find('select[name="fromWarehouse"]').val();
				var fromDloc = $('.search-form').find('select[name="fromDloc"]').val();
				var fromLoc = $('.search-form').find('select[name="fromLoc"]').val();
				var descWarehouse = $('.search-form').find('select[name="descWarehouse"]').val();
				var descDloc = $('.search-form').find('select[name="descDloc"]').val();
				var descLoc = $('.search-form').find('select[name="descLoc"]').val();
				var transType = $('.search-form').find('select[name="transType"]').val();
				var opType = $('.search-form').find('select[name="opType"]').val();
				var fromBarcode = $('.search-form').find('input[name="fromBarcode"]').val();
				var toBarcode = $('.search-form').find('input[name="toBarcode"]').val();
				d.plant = plant;
				d.partId = partId;
				d.fromWarehouse = fromWarehouse;
				d.fromDloc = fromDloc;
				d.fromLoc = fromLoc;
				d.descWarehouse = descWarehouse;
				d.descDloc = descDloc;
				d.descLoc = descLoc;
				d.transType = transType;
				d.opType = opType;
				d.fromBarcode = fromBarcode;
				d.toBarcode = toBarcode;
				var transTime = $("#timeRange").val();
				d.transTime = transTime;
				return d;
			}
		},
		order : [ [ 10, 'desc' ] ],
		columns : [ {
			data : 'plant.no'
		}, {
			data : 'part.no'
		}, {
			data : 'part.name',
		}, {
			data : 'opType',
		},  {
			data : 'transType',
		},{
			data : 'qty',
		}, {
			data : 'fromWarehouse.no',
		}, {
			data : 'fromDloc.no',
		}, {
			data : 'fromLoc.no',
		}, {
			data : 'fromBarcode',
		}, {
			data : 'transTime',
		}, {
			data : 'toWarehouse.no', defaultContent: ''
		}, {
			data : 'toDloc.no', defaultContent: ''
		}, {
			data : 'toLoc.no', defaultContent: ''
		}, {
			data : 'toBarcode',
		}, {
			data : 'owner',
		}, {
			data : 'acount',
		}, {
			data : 'costCentre',
		}, {
			data : 'interPoNo',
		}, {
			data : 'remark1',
		}, {
			data : 'remark2',
		}, {
			data : 'remark3',
		} ]
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
	
	// 工厂下拉搜索
	$("#plant").select2({
		ajax : {
			url : rootUrl + "/api/master/plants",
		}
	});

	// 零件号下拉搜索
	$("#partId").linkSelect2("plant", rootUrl + "/api/master/parts", "plant");

	$("#fromWarehouse").linkSelect2("plant", rootUrl + "/api/master/warehouses", "plant");

	$("#fromDloc").linkSelect2("fromWarehouse", rootUrl + "/api/master/dlocs", "fromWarehouse");

	$("#fromLoc").linkSelect2("fromDloc", rootUrl + "/api/master/locs", "fromDloc");

	$("#descWarehouse").linkSelect2("plant", rootUrl + "/api/master/warehouses", "plant");

	$("#descDloc").linkSelect2("descWarehouse", rootUrl + "/api/master/dlocs", "descWarehouse");

	$("#descLoc").linkSelect2("descDloc", rootUrl + "/api/master/locs", "descDloc");

	$("#username").select2({
		ajax : {
			url : rootUrl + "/api/system/users",
			data : function(params) {
				params.q = params.term;
				return params;
			}
		}
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
	
	// 导出 动态组织form提交
	$(".btn.export").on("click", function (e) {
		$("#exportForm .param").remove();
			var $frm = $("#exportForm");
	　　　	var array = $('.search-form').serializeArray();
	　　　	var rebateMap = {};
	　　　	for (i = 0, length = array.length; i < length; i++) {
	　　　		key = array[i].name;
	　　　		value = array[i].value;
	　　　		$frm.append($('<input class="param" type="hidden" name = "' + key + '" value = "' + value + '" />')); 
	　　　		rebateMap[key] = value;
	　　　	}
		
		var newData = JSON.stringify(rebateMap);
	　	$.ajax({
	　		url:baseUrl + '/qTotal',
	　		type : 'get',
	　		dataType:"json",
	   		data: {
	   			"paramStr" : newData
	    	},
			success : function(data) {
				if(data == 1){
					bootbox.alert("fail:导出数据时，请输入查询条件导出！");
				} else if(data == 2){
					bootbox.alert("fail:查询数据超出限值，请精确查询再做导出!");
				} else if(data == 3){
					bootbox.alert("fail:导出时出现异常，请重新查询再导出!");
				} else {
					var params = table.ajax.params();
					$frm.append($('<input class="param" type="hidden" name="input" value = \'' + JSON.stringify(params) + '\' />'));
					$frm.append($('<input class="param" type="hidden" name="transTime" value = \'' + $("#timeRange").val() + '\' />')); 
					$frm.submit();
				}
			},
	    	error : function(data) {
	    		bootbox.alert("fail:导出时出现异常，请重新查询再导出!");
			}
		});
		
		// 阻止默认行为
		e.preventDefault();
		return false;  
	  });
})