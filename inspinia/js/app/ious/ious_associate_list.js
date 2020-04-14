/**
 * 白条关联收货
 * by xiaowei
 */

$(document).ready(function() {
	
	var table = $('table#table').DataTable({
		ajax: baseUrl + '/datatable',
		order : [ [ 9, 'desc' ] ], // 入库时间倒序
		columns : [ 
			{ name : 'sdsNo', data : 'sdsNo', defaultContent : '', 'class' : 'text-center' },
			{ name : 'part', data : 'part.id', defaultContent : '', 'class' : 'text-center', visible: false },
			{ name : 'partNo', data : 'part.no', defaultContent : '', 'class' : 'text-center' },
			{ name : 'partName', data : 'part.name', defaultContent : '', 'class' : 'text-center' },
			{ name : 'suppl', data : 'suppl.id', defaultContent : '', 'class' : 'text-center', visible: false },
			{ name : 'supplNo', data : 'suppl.no', defaultContent : '', 'class' : 'text-center' },
			{ name : 'locNo', data : 'loc.no', defaultContent : '', 'class' : 'text-center' },
			{ name : 'batch', data : 'batch', defaultContent : '', 'class' : 'text-center' },
			{ name : 'barcode', data : 'barcode', defaultContent : '', 'class' : 'text-center' },
			{ name : 'receiveTime', data : 'receiveTime', defaultContent : '', 'class' : 'text-center', visible: false },
			{ name : 'requiredQty', data : 'requiredQty', defaultContent : '', 'class' : 'text-center' },
			{ name : 'receiveQty', data : 'receiveQty', defaultContent : '', 'class' : 'text-center' },
			{ name : 'packNo', data : 'pack.no', defaultContent : '', 'class' : 'text-center' },
			{ name : 'pQty', data : 'pQty', defaultContent : '', 'class' : 'text-center' },
			{ name : 'associateQty', data : 'associateQty', defaultContent : '', sortable: false }, 
			{ data : "id", defaultContent : '', sortable : false, 'class' : 'text-center',
				render : function(data, type, row, meta) {
					if (row.receiveQty > 0) {
						return '<a class="btn btn-default btn-xs" href="' + rootUrl + '/wms/ious/' + row.id + '"><i class="fa fa-chain" title="关 联"></i></a>';
					} else {
						return '&nbsp;';
					}
				}
			}]
	});
	
	$('.search-form').on("submit", function(e) {
		var sdsNo = $('.search-form').find('input#sdsNo').val();
		var suppl = $('.search-form').find('select#supplier').val();
		var part = $('.search-form').find('select#part').val();
		var batch = $('.search-form').find('input#batch').val();
		var barcode = $('.search-form').find('input#barcode').val();
		table.column('sdsNo:name').search(sdsNo);
		table.column('suppl:name').search(suppl);
		table.column('part:name').search(part);
		table.column('batch:name').search(batch);
		table.column('barcode:name').search(barcode);
		e.preventDefault();
		table.draw();
		// 阻止表单submit
		return false;
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