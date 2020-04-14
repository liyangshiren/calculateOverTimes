$(document).ready(
function() {
	
	$("#partNo").inputarea();
	//$("#locNo").inputarea();
	$("#barcodeNo").inputarea();
//	$("#warehouse").inputarea();
	
	var table = $('table#table').DataTable({
		scrollX : true,
		autoWidth:true,
		ajax : {
			url : baseUrl + '/datatable',
			type : "POST",
			data : function(d) {
				var times = $("#timeRange").val();
				d.times = times;
				d.isDelete = $("#isDelete").val();
				d.partNo = $("#partNo").val();
				//d.locNo = $("#locNo").val();
//				d.warehouse = $("#warehouse").val();
//				d.warehouse = $("#warehouse").val();
				d.barcode = $("#barcodeNo").val();
				return d;
			}
		},
		order : [ [ 16, 'desc' ] ],
		columns : [
			{name : "warehouse",data : "warehouse.id", defaultContent:'', visible : false},
			{name : "dloc",data : "dloc.id", defaultContent:'',visible : false},
			{name : "loc",data : "loc.id", defaultContent:'',visible : false},
			{name : "suppl",data : "suppl.id", defaultContent:'',visible : false},
			{name : "part",data : "part.id", defaultContent:'',visible : false},
			{	data : 'id',sortable : false, defaultContent : '', 'class' : 'text-center',
				render : function(data, type, row, meta) {
					return '<div class="checkbox"><input type="checkbox" name="ids" value="' + data
							+ '"/><label for="ids"/></div>'
				}
			},
			{data : "warehouse.no", defaultContent:''},
			{data : 'dloc.no', defaultContent:'' },
			{name : 'locNo',data : 'loc.no', defaultContent:'' },
			{name : 'partNo',data : 'part.no', defaultContent:'' },
			{name : 'partName',data : 'part.name', defaultContent:'' },
			{data : 'suppl.no', defaultContent:'' },
			{ data : 'barcode'},
			{ data : 'quantity' },
			{ data : 'pack.no', defaultContent:'' },
			{ data : 'pQty' },
			{ data : 'inStorageDate' },
			{ data : 'lockStatus', 
			  render : function(data, type, row, meta) {
				return data == '1' ? "锁定" :  "正常";
			  }
			},
			{ data : 'lockQty' },
			{ data : 'isOnroad',
			  render : function(data, type, row, meta) {
			    return data == '1' ? "在途" :  "正常";
			  }
			},
			{ data : 'onwayQty' },
			{ 
			  name : 'isDelete',
			  data : 'isDelete',
			  render : function(data, type, row, meta) {
					return data == '1' ? "是" :  "否";
			  }
			} ,
			{ data : 'unit', name : 'unit' },
			{ data : 'owner', render : function(data, type, row, meta) {
				return data == '1' ? "寄售" : data == "0" ? "自有" : "";
			}
		  },
			{ data : 'batch', name : 'batch' },
			{name : 'partState', data : 'partState',
				render : function(data, type, row, meta) {
					return PART_STATE && PART_STATE[data] ? PART_STATE[data].text : '';
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

	table.on('click', '.del', function() {
		var id = table.row($(this).parents('tr')).data().id;
		$("#delForm #ids").val(id);
		if (id) {
			bootbox.confirm("确定要删除数据吗?", function(result) {
				if (result) {
					$("#delForm").submit();
				}
			});
		}
	});
	$(".btn.delAll").on("click", function(e) {
		var ids = [];
		$('#table>tbody input:checked').each(function(i, item) {
			ids.push($(item).val());
		});
		$("#delForm #ids").val(ids.join(","));
		if (ids.length > 0) {
			bootbox.confirm("确定要删除选中的数据吗?", function(result) {
				if (result) {
					$("#delForm").submit();
				}
			});
		} else {
			bootbox.alert("请选择要删除的数据.");
		}
	});
	
	$('.search-form').on("submit", function(e) {
		var wh = $('.search-form').find('select[name="warehouse"]').val();
		var dloc = $('.search-form').find('select[name="dloc"]').val();
		var loc = $('.search-form').find('select[name="loc"]').val();
		var suppl = $('.search-form').find('select[name="suppl"]').val();
		var partName = $('.search-form').find('input[name="partName"]').val();
		var partNo = $('.search-form').find('input[name="partNo"]').val();
		var timeRange = $('.search-form').find('input[name="timeRange"]').val();
		var barcodeNo = $('.search-form').find('input[name="barcodeNo"]').val();
		var partState = $('.search-form').find('select[name="partState"]').val();
		var batch = $('.search-form').find('input[name="batch"]').val();
		//var barcode = $('.search-form').find('input[name="barcodeNo"]').val();
		if(!wh && !dloc && !loc && !suppl && !partName && !partState && !partNo &&!timeRange && !barcodeNo){
			bootbox.alert("请选择查询条件进行查询.");
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
					var times = $("#timeRange").val();
					var barcode = $('.search-form').find('input[name="barcodeNo"]').val();
					var batch = $('.search-form').find('input[name="batch"]').val();
					var partState = $('.search-form').find('select[name="partState"]').val();
					var isDelete = $('.search-form').find('select[name="isDelete"]').val();
					$frm.append($('<input class="param" type="hidden" name = "warehouse" value = "' + wh + '" />')); 
					$frm.append($('<input class="param" type="hidden" name = "dloc" value = "' + dloc + '" />')); 
					$frm.append($('<input class="param" type="hidden" name = "loc" value = "' + loc + '" />'));
					$frm.append($('<input class="param" type="hidden" name = "suppl" value = "' + suppl + '" />'));
					$frm.append($('<input class="param" type="hidden" name = "partNo" value = "' + partNo + '" />'));
					$frm.append($('<input class="param" type="hidden" name = "partName" value = "' + partName + '" />'));
					$frm.append($('<input class="param" type="hidden" name = "times" value = "' + times + '" />'));
					$frm.append($('<input class="param" type="hidden" name = "barcode" value = "' + barcode + '" />'));
					$frm.append($('<input class="param" type="hidden" name = "batch" value = "' + batch + '" />'));
					$frm.append($('<input class="param" type="hidden" name = "partState" value = "' + partState + '" />'));
					$frm.append($('<input class="param" type="hidden" name = "isDelete" value = "' + isDelete + '" />'));
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
