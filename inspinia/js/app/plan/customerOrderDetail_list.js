$(document).ready(
		function() {
			var table = $('table#table').DataTable(
					{
						ajax: {
					    	url:baseUrl + '/datatable',
					    	data: {
					    		customerOrderId: customerOrderId
					    	}
					    },
						order : [ [ 1, 'desc' ] ],
						columns : [
//								{
//							      data: 'id',
//							      sortable: false,
//							      'class': 'text-center',
//							      defaultContent: '',
//							      render: function (data, type, row, meta) {
//							        return '<div class="checkbox"><input type="checkbox" name="ids" value="' + data + '"/><label for="ids"/></div>'
//							      }
//							    },
							 	{data: 'customerOrder.id', name : 'customerOrder', defaultContent : '', visible : false},
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
								{data: 'model',name:'model', 'class': 'text-center',defaultContent: '',
							    	render: function (data, model, row, meta) {
							        	return VALUES_MAP_MODEL && VALUES_MAP_MODEL[data] ? VALUES_MAP_MODEL[data].text : '';
							        }
								},
								{
									data : 'requiredQty',
									defaultContent : '',
									/*'class' : 'text-center'*/
								},
								{
									name : 'unit',
									data : 'unit',
									defaultContent : ''
								},
								{
									name : 'requiredDate',
									data : 'requiredDate',
									defaultContent : ''
								},
								 {data: 'id', sortable: false, 'class': 'text-center',
								      render: function (data, type, row, meta) {
								        return ('<div class="btn-group">' +
											'<a class="btn btn-default btn-xs" title="修改" href="' + baseUrl + '/edit/' + row.id + '"><i class="fa fa-edit"></i></a>' +
								            '<a class="btn btn-default btn-xs del" title="删除" href="#"><i class="fa fa-trash-o"></i></a>' +
								            '</div>&nbsp;&nbsp;');
								      }
							        }]
					    
					});
			
			 table.on('click', '.del', function () {
				    var id = table.row($(this).parents('tr')).data().id;
				    $("#delForm #ids").val(id);
				      if (id) {
				        bootbox.confirm("确定要删除数据吗?", function (result) {
				          if (result) {
				            $("#delForm").submit();
				          }
				       });
				     }
				  });

			  
		});
