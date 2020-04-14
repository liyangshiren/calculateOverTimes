$(document).ready(
		function() {
			var table = $('table#table').DataTable(
					{
						ajax: {
					    	url:baseUrl + '/datatable',
					    	data: {
					    		pickTicketId: pickTicketId
					    	}
					    },
						order : [ [ 1, 'desc' ] ],
						columns : [
							 	{data: 'pickTicket.id', name : 'pickTicket', defaultContent : '', visible : false},
								{
									name : 'barcode',
									data : 'barcode',
									defaultContent : ''
								},
								{
									name : 'quantity',
									data : 'quantity',
									defaultContent : ''

								},
								{
									name : 'loc',
									data : 'loc.no',
									defaultContent : '',
									/*'class' : 'text-center'*/
								},
								{
									name : 'batch',
									data : 'batch',
									defaultContent : '',
									/*'class' : 'text-center'*/
								},
								{
									name : 'supplier',
									data : 'supplier.no',
									defaultContent : '',
									/*'class' : 'text-center'*/
								},
								{
									name : 'createdBy',
									data : 'createdBy',
									defaultContent : '',
									/*'class' : 'text-center'*/
								},
								{
									name : 'createdDate',
									data : 'createdDate',
									defaultContent : '',
									/*'class' : 'text-center'*/
								}]
					});

			  
		});
