$(document).ready(
		function() {
			var table = $('table#table').DataTable(
					{
						ajax: {
					    	url:baseUrl + '/datatable',
					    	data: {
					    		packageBatchId: packageBatchId,
								partNo: $("#partNo").val()
					    	}
					    },
						order : [ [ 1, 'desc' ] ],
						columns : [
							 	{data: 'packageBatch.id', name : 'packageBatch', defaultContent : '', visible : false},
							 	{
							 	      data: 'id',
							 	      sortable: false,
							 	      defaultContent: '',
							 	      'class': 'text-center',
							 	      render: function (data, type, row, meta) {
							 	        return '<div class="checkbox"><input type="checkbox" name="ids" value="' + data + '"/><label for="ids"/></div>'
							 	      }
							 	},
								{
									name : 'leveloneBarcode',
									data : 'leveloneBarcode',
									defaultContent : ''
								},
								{
									name : 'partNo',
									data : 'partNo',
									defaultContent : ''
								},
								{
									name : 'partName',
									data : 'partName',
									defaultContent : ''

								},
								{
									name : 'requiredQty',
									data : 'requiredQty',
									defaultContent : '',
									/*'class' : 'text-center'*/
								},
								{
									name : 'packageQty',
									data : 'packageQty',
									defaultContent : '',
									/*'class' : 'text-center'*/
								},
								{
									name : 'levelonePackage',
									data : 'levelonePackage',
									defaultContent : ''
								},
								{
									name : 'leveltwoPackage',
									data : 'leveltwoPackage',
									defaultContent : ''
								},
								{
									data: 'status',
							        render: function (data, type, row, meta) {
							          return VALUES_MAP_DICT_STATUS && VALUES_MAP_DICT_STATUS[data] ? VALUES_MAP_DICT_STATUS[data].text : '';
							        }
								},
								{
									name : 'unit',
									data : 'unit',
									defaultContent : '',
									/*'class' : 'text-center'*/
								},
								{
									data: 'printStatus',
									render: function (data, type, row, meta) {
										return VALUES_MAP_DICT_PRINT_STATUS && VALUES_MAP_DICT_PRINT_STATUS[data] ? VALUES_MAP_DICT_PRINT_STATUS[data].text : '';
									}
								},
								{
							        data: "id",
							        defaultContent: '',
							        sortable: false,
							        'class': 'text-center',
							        render: function (data, type, row, meta) {
							            return '<a class="btn btn-default btn-xs" href="'+rootUrl+'/wms/packageAct/'+ row.id + '"><i class="fa fa-list"></i></a>';
							        }
							    }]
					});
			$(".btn.printAll").on("click", function (e) {
			    var ids = [];
			    $('#table>tbody input:checked').each(function (i, item) {
			      ids.push($(item).val());
			    });
			    $("#printForm #ids").val(ids.join(","));
			    if (ids.length > 0) {
			    	 $("#printForm").submit();
			    } 
			  });

			 
		});
