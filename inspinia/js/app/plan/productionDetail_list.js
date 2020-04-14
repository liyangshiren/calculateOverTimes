$(document).ready(
		function() {
			var table = $('table#table').DataTable(
					{
						ajax: {
					    	url:baseUrl + '/datatable',
					    	data: {
					    		productionPlanId: productionPlanId
					    	}
					    },
						order : [ [ 1, 'desc' ] ],
						columns : [
							 	{data: 'productionPlan.id', name : 'customerOrder', defaultContent : '', visible : false},
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
								      data: "",
								      defaultContent: '',
								      sortable: false,
								      'class': 'text-center',
								      render: function (data, type, row, meta) {
								          var div = "";
								          
								        	  div = '<div class="btn-group">' +
								                      '<a class="btn btn-default btn-xs" title="修改" href="' + baseUrl + '/edit/' + row.id + '"><i class="fa fa-edit"></i></a>' +
								                      '<a class="btn btn-default btn-xs del" title="删除" href="#"><i class="fa fa-trash-o"></i></a>' +
								                      '</div>' +
								                      '&nbsp;&nbsp;';
								          return div;
								      }
								    }]
					});
			var planPackageDateHidden = $("#planPackageDateHidden").val();
			table.on('click', '.del', function () {
			    var id = table.row($(this).parents('tr')).data().id;
			    console.warn(id); 
			    $("#delForm #ids").val(id);
			    $("#delForm #planPackageDateHiddenDel").val(planPackageDateHidden);
			    if (id) {
			      bootbox.confirm("确定要删除数据吗?", function (result) {
			        if (result) {
			        	console.warn(result); 
			          $("#delForm").submit();
			        }
			      });
			    }
			  });
			  
			  $(".btn.delAll").on("click", function (e) {
				    var ids = [];
				    $('#table>tbody input:checked').each(function (i, item) {
				      ids.push($(item).val());
				    });
				    $("#delForm #ids").val(ids.join(","));
				    if (ids.length > 0) {
				      bootbox.confirm("确定要删除选中的数据吗?", function (result) {
				        if (result) {
				          $("#delForm").submit();
				        }
				      });
				    } else {
				      bootbox.alert("请选择要删除的数据.");
				    }
				  });

			  
		});


