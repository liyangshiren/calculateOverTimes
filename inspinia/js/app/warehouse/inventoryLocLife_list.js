$(document).ready(
function() {
	$("#partNo").inputarea();
	var table = $('table#table').DataTable({
		scrollX : true,
		autoWidth:true,
		ajax : {
			url : baseUrl + '/datatable',
			type : "POST",
			data : function(d) {
				var times = $("#actionTimeRange").val();
				d.times = times;
				d.partNo = $("#partNo").val();
				d.partName = $("#partName").val();
				d.warehouse = $("#warehouse").val();
				d.dloc = $("#dloc").val();
				d.loc = $("#loc").val();
				d.suppl = $("#suppl").val();
				d.barcode = $("#barcode").val();
				d.batch = $("#batch").val();
//				d.outsidePullNo = $("#outsidePullNo").val();
//				d.insidePullNo = $("#insidePullNo").val();
				d.actionType = $("#actionType").val();
				d.actionOperator = $("#actionOperator").val();
				d.frameoutSheetNo = $("#frameoutSheetNo").val();
				d.sendSheetNo = $("#sendSheetNo").val();
				d.leveloneBarcode = $("#leveloneBarcode").val();
				d.leveltwoBarcode = $("#leveltwoBarcode").val();
				d.containerBarcode = $("#containerBarcode").val();
				return d;
			}
		},
		order : [ [ 11, 'desc' ] ],
		columns : [
			{	data : 'id',sortable : false, defaultContent : '', 'class' : 'text-center',
				render : function(data, type, row, meta) {
					return '<div class="checkbox"><input type="checkbox" name="ids" value="' + data
							+ '"/><label for="ids"/></div>'
				}
			},
			{data : 'warehouseNo', defaultContent:'' },
			{data : 'dlocNo', defaultContent:'' },
			{data : 'locNo', defaultContent:'' },
			{data : 'partNo', defaultContent:'' },
			{data : 'partName', defaultContent:'' },
			{data : 'supplNo', defaultContent:'' },
			{data : 'batch', defaultContent:'' },
			{data : 'barcode', defaultContent:'' },
			{data : 'quantity', defaultContent:'' },
			{data : 'actionQuantity', defaultContent:'' },
			{data : 'actionDate', defaultContent:'' },
			{data : 'actionOperator', defaultContent:'' },
			{data : 'customerOrderNo', defaultContent:'' },
			{data : 'leveloneBarcode', defaultContent:'' },
			{data : 'leveltwoBarcode', defaultContent:'' },
			{data : 'containerBarcode', defaultContent:'' },
			{name : 'actionType',  data : 'actionType', defaultContent:'',
		        render: function (data, actionType, row, meta) {
		        	return VALUES_MAP_ACTION_TYPE && VALUES_MAP_ACTION_TYPE[data] ? VALUES_MAP_ACTION_TYPE[data].text : '';
		        }	
			},
			/*{data : 'outsidePullNo', defaultContent:'' },
			{data : 'outsidePullType', defaultContent:'' ,
				render: function (data, type, row, meta) {
			      	return VALUES_MAP_DICT_TYPE && VALUES_MAP_DICT_TYPE[data] ? VALUES_MAP_DICT_TYPE[data].text : '';
			        }},
			{data : 'insidePullNo', defaultContent:'' },
			{data : 'insidePullType', defaultContent:'' ,
				render: function (data, type, row, meta) {
			      	return VALUES_MAP_DICT_TYPE && VALUES_MAP_DICT_TYPE[data] ? VALUES_MAP_DICT_TYPE[data].text : '';
			        }},*/
			{data : 'frameoutSheetNo', defaultContent:'' },
			{data : 'sendSheetNo', defaultContent:'' },
			{data : 'packageNo', defaultContent:'' },
			{data : 'packageQty', defaultContent:'' },
			{data : 'remark', defaultContent:'' }		
			]
	});
	$('#actionTimeRange').daterangepicker({
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
		$('#actionTimeRange').val(start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));
	});
	$('#actionTimeRange').val(moment({hour: 0, minute: 0, second: 0}).subtract(6, 'days').format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment({hour: 23, minute: 59, second: 59}).format('YYYY-MM-DD HH:mm:ss'));

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
		var batch = $('.search-form').find('input[name="batch"]').val();
		var barcode = $('.search-form').find('input[name="barcode"]').val();
//		var outsidePullNo = $('.search-form').find('input[name="outsidePullNo"]').val();
//		var insidePullNo = $('.search-form').find('input[name="insidePullNo"]').val();
		var actionTimes = $("#actionTimeRange").val();
		var actionType = $('.search-form').find('select[name="actionType"]').val();
	    var actionOperator = $('.search-form').find('input[name="actionOperator"]').val(); 
	    var frameoutSheetNo = $('.search-form').find('input[name="frameoutSheetNo"]').val();
		var sendSheetNo = $('.search-form').find('input[name="sendSheetNo"]').val();
		var leveloneBarcode = $('.search-form').find('input[name="leveloneBarcode"]').val();
		var leveltwoBarcode = $('.search-form').find('input[name="leveltwoBarcode"]').val();
		var containerBarcode = $('.search-form').find('input[name="containerBarcode"]').val();
		if(!wh && !dloc && !loc && !suppl && !partNo && !partName && !batch && !barcode 
//				  && !outsidePullNo && !insidePullNo 
				  && !actionTimes 
				  && !actionType && !actionOperator && !frameoutSheetNo && !sendSheetNo
				  && !leveloneBarcode && !leveltwoBarcode && !containerBarcode){
			
				  bootbox.alert("请选择查询条件进行查询");
				  return false;
			  }
		
		table.draw();
		// 阻止表单submit
		return false;
	});
	
	//导出动态组织form提交
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
					var wh = $('.search-form').find('select[name="warehouse"]').val();
					var dloc = $('.search-form').find('select[name="dloc"]').val();
					var loc = $('.search-form').find('select[name="loc"]').val();
					var suppl = $('.search-form').find('select[name="suppl"]').val();
					var partNo = $('.search-form').find('input[name="partNo"]').val();
					var partName = $('.search-form').find('input[name="partName"]').val();
					var times = $("#actionTimeRange").val();
					var barcode = $('.search-form').find('input[name="barcode"]').val();
					var batch = $('.search-form').find('input[name="batch"]').val();
//					var outsidePullNo = $('.search-form').find('input[name="outsidePullNo"]').val();
//					var insidePullNo = $('.search-form').find('input[name="insidePullNo"]').val();
					var actionType = $('.search-form').find('input[name="actionType"]').val();
					var actionOperator = $('.search-form').find('input[name="actionOperator"]').val();
					var frameoutSheetNo = $('.search-form').find('input[name="frameoutSheetNo"]').val();
					var sendSheetNo = $('.search-form').find('input[name="sendSheetNo"]').val();
					var leveloneBarcode = $('.search-form').find('input[name="leveloneBarcode"]').val();
					var leveltwoBarcode = $('.search-form').find('input[name="leveltwoBarcode"]').val();
					var containerBarcode = $('.search-form').find('input[name="containerBarcode"]').val();
					$frm.append($('<input class="param" type="hidden" name = "warehouse" value = "' + wh + '" />')); 
					$frm.append($('<input class="param" type="hidden" name = "dloc" value = "' + dloc + '" />')); 
					$frm.append($('<input class="param" type="hidden" name = "loc" value = "' + loc + '" />'));
					$frm.append($('<input class="param" type="hidden" name = "suppl" value = "' + suppl + '" />'));
					$frm.append($('<input class="param" type="hidden" name = "partNo" value = "' + partNo + '" />'));
					$frm.append($('<input class="param" type="hidden" name = "partName" value = "' + partName + '" />'));
					$frm.append($('<input class="param" type="hidden" name = "times" value = "' + times + '" />'));
					$frm.append($('<input class="param" type="hidden" name = "barcode" value = "' + barcode + '" />'));
					$frm.append($('<input class="param" type="hidden" name = "batch" value = "' + batch + '" />'));
//					$frm.append($('<input class="param" type="hidden" name = "outsidePullNo" value = "' + outsidePullNo + '" />'));
//					$frm.append($('<input class="param" type="hidden" name = "insidePullNo" value = "' + insidePullNo + '" />'));
					$frm.append($('<input class="param" type="hidden" name = "actionType" value = "' + actionType + '" />'));
					$frm.append($('<input class="param" type="hidden" name = "actionOperator" value = "' + actionOperator + '" />'));
					$frm.append($('<input class="param" type="hidden" name = "frameoutSheetNo" value = "' + frameoutSheetNo + '" />'));
					$frm.append($('<input class="param" type="hidden" name = "sendSheetNo" value = "' + sendSheetNo + '" />'));
					$frm.append($('<input class="param" type="hidden" name = "leveloneBarcode" value = "' + leveloneBarcode + '" />'));
					$frm.append($('<input class="param" type="hidden" name = "leveltwoBarcode" value = "' + leveltwoBarcode + '" />'));
					$frm.append($('<input class="param" type="hidden" name = "containerBarcode" value = "' + containerBarcode + '" />'));
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
	
});
