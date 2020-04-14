$(document).ready(function() {
	var table = $('table#table').DataTable({
//		scrollX : true,
//		autoWidth : true,
		ajax : {
			url : baseUrl + '/analysisDatatable',
			type : "POST",
			data : function(d) {
				d.invCountId = id;
				d.locNo = $("#locNo").val();
				d.partNo = $("#partNoSearch").val();
				d.supplNo = $("#supplNoSearch").val();
				d.barcode = $("#barcode").val();
				d.isDiff = $("#isDiff").val();
				return d;
			}
		},
		columns : [
			{ name : 'locNo', data : 'loc.no', sortable: false, defaultContent : '', 'class' : 'text-center'},
			{ name : 'partNo', data : 'part.no', sortable: false, defaultContent : '', 'class' : 'text-center'},
			{ name : 'partName', data : 'part.name', sortable: false, defaultContent : '', 'class' : 'text-center'},
			{ name : 'supplNo', data : 'suppl.no', sortable: false, defaultContent : '', 'class' : 'text-center'},
			{ name : 'barcode', data : 'barcode', sortable: false, defaultContent : '', 'class' : 'text-center'},
			{ name : 'invQty', data : 'invQty', sortable: false, defaultContent : '', 'class' : 'text-center'},
			{ name : 'lockQty', data : 'lockQty', sortable: false, defaultContent : '', 'class' : 'text-center'},
			{ name : 'countQty', data : 'countQty', sortable: false, defaultContent : '', 'class' : 'text-center'},
			{ name : 'diffQty', data : 'diffQty', sortable: false, defaultContent : '', 'class' : 'text-center',
				createdCell: function (td, cellData, rowData, row, col) {
                   if ( cellData != null && cellData != 0 ) { $(td).css('background-color', 'red'); }
                },
			},
			{ name : 'countLocNo', data : 'countLocNo', sortable: false, defaultContent : '', 'class' : 'text-center'},
			{ name : 'countUsername', data : 'countUsername', sortable: false, defaultContent : '', 'class' : 'text-center'},
			{ name : 'countDate', data : 'countDate', sortable: false, defaultContent : '', 'class' : 'text-center'},
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
	
	$("#partNo").inputarea();
	$("#locNo").inputarea();
	$("#supplNo").inputarea();
	
})