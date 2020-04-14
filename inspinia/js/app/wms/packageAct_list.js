$(document).ready(
		function() {
			var table = $('table#table').DataTable(
					{
						ajax: {
					    	url:baseUrl + '/datatable',
					    	data: {
					    		packageDetailId: packageDetailId
					    	}
					    },
						order : [ [ 1, 'desc' ] ],
						columns : [
							 	{data: 'packageDetail.id', name : 'packageDetail', defaultContent : '', visible : false},
								{
									name : 'originalBarcode',
									data : 'originalBarcode',
									defaultContent : ''
								},
								{
									name : 'quantity',
									data : 'quantity',
									defaultContent : ''

								},
								{
									name : 'batch',
									data : 'batch',
									defaultContent : '',
								},
								{
									name : 'supplier',
									data : 'supplier.no',
									defaultContent : '',
								},
								{
									name : 'createdBy',
									data : 'createdBy',
									defaultContent : '',
								},
								{
									name : 'createdDate',
									data : 'createdDate',
									defaultContent : '',
								},
								{
									name : 'lastModifiedBy',
									data : 'lastModifiedBy',
									defaultContent : '',
								},
								{
									name : 'lastModifiedDate',
									data : 'lastModifiedDate',
									defaultContent : '',
								}]
					});

			  
		});
