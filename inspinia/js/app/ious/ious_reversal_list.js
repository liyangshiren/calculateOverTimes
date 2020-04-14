/**
 * 白条关联收货
 * by xiaowei
 */

$(document).ready(function() {
	
	var table = $('table#table').DataTable({
		responsive: true,
		scrollX: true,
		autoWidth: true,
		ajax: baseUrl + '/iousdatatable',
		order : [ [ 14, 'desc' ] ], // 入库时间倒序
		columns : [ 
			{ data: 'id', sortable: false, defaultContent: '', 'class': 'text-center',
		      render: function (data, type, row, meta) {
	    		  return '<div class="checkbox"><input type="checkbox" name="ids" value="' + data + '"/><label for="ids"/></div>'
		      }
		    }, 
			{ name : 'sdsNo', data : 'sdsNo', defaultContent : '', 'class' : 'text-center' },
			{ name : 'part', data : 'part.id', defaultContent : '', 'class' : 'text-center', visible: false },
			{ name : 'partNo', data : 'part.no', defaultContent : '', 'class' : 'text-center' },
			{ name : 'partName', data : 'part.name', defaultContent : '', 'class' : 'text-center' },
			{ name : 'suppl', data : 'suppl.id', defaultContent : '', 'class' : 'text-center', visible: false },
			{ name : 'supplNo', data : 'suppl.no', defaultContent : '', 'class' : 'text-center' },
			{ name : 'locNo', data : 'loc.no', defaultContent : '', 'class' : 'text-center' },
			{ name : 'batch', data : 'batch', defaultContent : '', 'class' : 'text-center' },
			{ name : 'receiveQty', data : 'receiveQty', defaultContent : '', 'class' : 'text-center' },
			{ name : 'packNo', data : 'pack.no', defaultContent : '', 'class' : 'text-center' },
			{ name : 'pQty', data : 'pQty', defaultContent : '', 'class' : 'text-center' },
			{ name : 'reversalQty', data : '', defaultContent : '', sortable: false ,
				render: function (data, type, row, meta) {
			        if (row.associateQty && row.associateQty > 0) {
			        	return row.receiveQty - row.associateQty;
			        } else {
			        	return row.receiveQty;
			        }
			      }
			},
			{ name : 'barcode', data : 'barcode', defaultContent : '', 'class' : 'text-center' },
			{ name : 'receiveTime', data : 'receiveTime', defaultContent : '', 'class' : 'text-center' }
		]
	});
	
	$('.search-form').on("submit", function(e) {
		var part = $('.search-form').find('select#part').val();
		var suppl = $('.search-form').find('select#supplier').val();
		var sdsNo = $('.search-form').find('input#sdsNo').val();
		var batch = $('.search-form').find('input#batch').val();
		var barcode = $('.search-form').find('input#barcode').val();
		table.column('part:name').search(part);
		table.column('suppl:name').search(suppl);
		table.column('sdsNo:name').search(sdsNo);
		table.column('batch:name').search(batch);
		table.column('barcode:name').search(barcode);
	    table.clear().draw();
		
		e.preventDefault();
		// 阻止表单submit
		return false;
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
	  		    url: baseUrl + '/reversal/0',  
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
	
	$('#clear').on("click", function(e) {
		table.columns().search('').draw();
	});
	
	// 零件号下拉搜索
	$("#part").select2({
		ajax : {
			url : rootUrl + "/api/master/parts"
		}
	});
	// 供应商下拉搜索
	$("#supplier").select2({
		ajax : {
			url : rootUrl + "/api/master/suppliers"
		}
	});
	
})