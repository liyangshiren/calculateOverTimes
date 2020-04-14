/**
 * 白条关联收货
 * by xiaowei
 */

$(document).ready(function() {
	
	var table = $('table#table').DataTable({
		ajax: {
			url : baseUrl + '/pusdatatable',
			data : function(d){
				d.pusNo = $('.search-form').find('input#sdsNo').val();
				d.supplId = $('.search-form').find('select#supplier').val();
				d.partId = $('.search-form').find('select#part').val();
				d.batch = $('.search-form').find('input#batch').val();
				d.barcode = $('.search-form').find('input#barcode').val();
				return d;
			}
		},
		order : [ [ 0, 'desc' ]],
		columns : [ 
			{ name : 'uid', data : 'id', defaultContent : '', 'class' : 'text-center', visible: false},
			{ data: 'id', sortable: false, defaultContent: '', 'class': 'text-center',
		      render: function (data, type, row, meta) {
		        return '<div class="checkbox"><input type="checkbox" name="ids" value="' + data + '"/><label for="ids"/></div>'
		      }
		    }, 
			{ name : 'sdsNo', data : 'sdsNo', defaultContent : '', 'class' : 'text-center', sortable: false },
			{ name : 'partNo', data : 'part', defaultContent : '', 'class' : 'text-center', sortable: false,
				render: function (data, type, row, meta) { return data ? data.no : ''; }
			},
			{ name : 'partName', data : 'part', defaultContent : '', 'class' : 'text-center', sortable: false,
				render: function (data, type, row, meta) { return data ? data.name : ''; }
			},
			{ name : 'supplNo', data : 'suppl', defaultContent : '', 'class' : 'text-center', sortable: false,
				render: function (data, type, row, meta) { return data ? data.no : ''; }
			},
			{ name : 'locNo', data : 'loc', defaultContent : '', 'class' : 'text-center', sortable: false,
				render: function (data, type, row, meta) { return data ? data.no : ''; }
			},
			{ name : 'batch', data : 'batch', defaultContent : '', 'class' : 'text-center', sortable: false,},
			{ name : 'packNo', data : 'pack', defaultContent : '', 'class' : 'text-center', sortable: false,
				render: function (data, type, row, meta) { return data ? data.no : ''; }
			},
			{ name : 'pQty', data : 'pQty', defaultContent : '', 'class' : 'text-center', sortable: false },
			{ name : 'reversalQty', data : 'reversalQty', defaultContent : '', sortable: false }, 
			{ name : 'barcode', data : 'barcode', defaultContent : '', 'class' : 'text-center', sortable: false,},
			{ name : 'receiveTime', data : 'receiveTime', defaultContent : '', 'class' : 'text-center', sortable: false }
		]
	});
	
	$('.search-form').on("submit", function(e) {
		table.draw();
		// 阻止表单submit
		return false;
	});
	
	$('#clear').on("click", function(e) {
		table.columns().search('').draw();
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
	  		    url: baseUrl + '/reversal/1',
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