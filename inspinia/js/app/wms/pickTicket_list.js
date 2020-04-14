$(document).ready(
		function() {
			var table = $('table#table').DataTable(
					{
						ajax: {
					    	url:baseUrl + '/datatable',
					    	data: {
					    		pickBatchId: pickBatchId
					    	}
					    },
						order : [ [ 1, 'desc' ] ],
						columns : [
							 	{data: 'pickBatch.id', name : 'pickBatch', defaultContent : '', visible : false},
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
									name : 'pickedQty',
									data : 'pickedQty',
									defaultContent : '',
									/*'class' : 'text-center'*/
								},
								{
									name : 'unit',
									data : 'unit',
									defaultContent : '',
									/*'class' : 'text-center'*/
								},
								{
							        data: "id",
							        defaultContent: '',
							        sortable: false,
							        'class': 'text-center',
							        render: function (data, type, row, meta) {
							            return '<a class="btn btn-default btn-xs" href="'+rootUrl+'/wms/pickAct/'+ row.id + '"><i class="fa fa-list"></i></a>';
							        }
							    }]
					});

			  
		});
