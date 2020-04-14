$(document).ready(function() {
	
	var table = $('table#table').DataTable({
		responsive: true,
		scrollX: true,
		autoWidth: true,
		ajax: {
	    	url:baseUrl + '/invDatatable',
	    	data: function(d){
	    		d.plantId = $('.search-form').find('select#plant').val();
	    		d.warehouseId = $('.search-form').find('select#warehouse').val();
	    		d.reversalFlag = $('.search-form').find('select#reversalFlag').val();
	    		d.receiveTimes = $('.search-form').find('input#receiveTimes').val();
	    		d.billType = $('.search-form').find('select#billType').val();
	    		d.part = $('.search-form').find('select#part').val();
	    		d.suppl = $('.search-form').find('select#supplier').val();
	    		d.sdsNo = $('.search-form').find('input#sdsNo').val();
	    		d.batch = $('.search-form').find('input#batch').val();
	    		d.barcode = $('.search-form').find('input#barcode').val();
	    		d.consignee = $('.search-form').find('input#consignee').val();
	    		d.dock = $('.search-form').find('input#dock').val();
	    		return d;
	    	}
	    },
	    order: [ [0, 'desc'] ],
		columns : [
			{ data: 'id', visible: false},
			{ data: 'id', name:'uid', sortable: false, defaultContent: '', 'class': 'text-center',
			  render: function (data, type, row, meta) {
				return '<div class="checkbox"><input type="checkbox" name="ids" value="' + data + '"/><label for="ids"/></div>';
			  }
			},
			{ data : 'loc.warehouse.no', name : 'warehouseNo', defaultContent: '','class' : 'text-center'}, 
			{ data : 'billType', name : 'billType', defaultContent: '','class' : 'text-center', 
				render: function (data, type, row, meta) {
					return VALUES_MAP_DICT_TYPE && VALUES_MAP_DICT_TYPE[data] ? VALUES_MAP_DICT_TYPE[data].text : '';
				}
			}, 
			{ data : 'sdsNo', name : 'sdsNo', defaultContent: '', 'class' : 'text-center'}, 
			{ data : 'part.id', name : 'part', defaultContent: '', visible: false}, 
			{ data : 'part.no', name : 'partNo', defaultContent: '','class' : 'text-center' }, 
			{ data : 'part.name', name : 'partName', defaultContent: '','class' : 'text-center' }, 
			{ data : 'suppl.id', name : 'suppl', defaultContent: '',visible: false}, 
			{ data : 'suppl.no', name : 'supplNo', defaultContent: '','class' : 'text-center' }, 
			{ data : 'batch', name : 'batch', defaultContent: '', 'class' : 'text-center' }, 
			{ data : 'receiveQty', name : 'receiveQty', 'class' : 'text-center' }, 
			{ data : 'loc.no', name : 'locNo', 'class' : 'text-center' },
			{ data : 'consignee', name : 'consignee', 'class' : 'text-center' }, 
			{ data : 'receiveTime', name : 'receiveTime', 'class' : 'text-center' },
			{ data : 'barcode', name : 'barcode', 'class' : 'text-center' }, 
			{ data : 'dock', name : 'dock', 'class' : 'text-center' }, 
			{ data : 'requiredQty', name : 'requiredQty', 'class' : 'text-center' }, 
			{ data : 'pack.no', name : 'pack.no', defaultContent: '','class' : 'text-center' }, 
			{ data : 'pQty', name : 'pQty', 'class' : 'text-center' }, 
			{ data : 'unit', name : 'unit', 'class' : 'text-center' }, 
			{ data : 'reversal', name : 'reversal', 'class' : 'text-center' }, 
			{ data : 'customerOrderNo', name : 'customerOrderNo', 'class' : 'text-center' }
		]
	});
	
	$("#plant").select2({ ajax: { url: rootUrl + "/api/master/plants" } });
	$("#warehouse").linkSelect2("plant", rootUrl + "/api/master/warehouses", "plant");
	$("#part").linkSelect2("plant", rootUrl + "/api/master/parts", "plant");
	$("#supplier").linkSelect2("plant", rootUrl + "/api/master/suppliers", "plant");
	
	$('#receiveTimes').daterangepicker({
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
	    }
	  }, function (start, end) {
	    $('#receiveTimes').val(start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));
	  });
	/**
	 * 冲销
	 */
	$(".btn.reversalBtn").on("click", function (e) {
	    var ids = [];
	    $('#table>tbody input:checked').each(function (i, item) {
	      ids.push($(item).val());
	    });
	    $("#reversalForm #ids").val(ids.join(","));
	    if (ids.length > 0) {
	      bootbox.confirm("确定要冲销选中的数据吗?", function (result) {
	        if (result) {
	          $.ajax({  
	  		    type: "POST",  
	  		    url: baseUrl + '/reversal',  
	  		    data:$('#reversalForm').serialize(),  
	  		    async: false,  
	  		    error: function(request) {  
	  		        alert("Connection error");  
	  		    },  
	  		    success: function(data) {  
	  		        //接收后台返回的结果
	  		    	if (data.success) {
	  		    		toastr.success(data.message, '提示信息!');
	  		    		table.draw(false);
	  		    	} else {
	  		    		toastr.error(data.message, '错误信息!', { timeOut: 0 });
	  		    	}
	  		    }
	  		  });
	        }
	      });
	    } else {
	    	toastr.warning('请选择要冲销的数据', '提示信息!');
	    }
	  });
	
	/**
	 * 查询
	 */
	$('.search-form').on("submit", function(e) {
//		var part = $('.search-form').find('select#part').val();
//		var suppl = $('.search-form').find('select#supplier').val();
//		var sdsNo = $('.search-form').find('input#sdsNo').val();
//		var batch = $('.search-form').find('input#batch').val();
//		var barcode = $('.search-form').find('input#barcode').val();
//		var consignee = $('.search-form').find('input#consignee').val();
//		var dock = $('.search-form').find('input#dock').val();
//		table.column('part:name').search(part);
//		table.column('suppl:name').search(suppl);
//		table.column('sdsNo:name').search(sdsNo);
//		table.column('batch:name').search(batch);
//		table.column('barcode:name').search(barcode);
//		table.column('consignee:name').search(consignee);
//		table.column('dock:name').search(dock);
	    table.clear().draw();
	    
		e.preventDefault();
		return false;
	});

	$('#clear').on("click", function(e) {
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
