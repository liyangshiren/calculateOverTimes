$(document)
		.ready(
				function() {
					var table = $('table#table')
							.DataTable(
									{
										ajax : baseUrl + '/datatable',
										order : [ [ 1, 'asc' ] ],
										columns : [
												{
													data : 'id',
													sortable : false,
													defaultContent : '',
													'class' : 'text-center',
													render : function(data,
															type, row, meta) {
														return '<div class="checkbox"><input type="checkbox" name="ids" value="'
																+ data
																+ '"/><label for="ids"/></div>'
													}
												},
												{
													name : 'user.fullname',
													data : 'user.fullname'
												},
												{
													name : 'projectItem.no',
													data : 'projectItem.no'
												},
												{
													name : 'projectItem.name',
													data : 'projectItem.name'
												},
												{
													data : "projectItem.approval",
													defaultContent : '',
													'class' : 'text-center',
													render : function(data,
															type, row, meta) {
														return data ? '<i class="fa fa-check-square-o"/>'
																: '<i class="fa fa-square-o"/>';
													}
												},
												{
													name : 'projectRole',
													data : 'projectRole'
												},
												{
													name : 'year',
													data : 'year'
												},
												{
													name : 'jan',
													data : 'jan'
												},
												{
													name : 'feb',
													data : 'feb'
												},
												{
													name : 'mar',
													data : 'mar'
												},
												{
													name : 'apr',
													data : 'apr'
												},
												{
													name : 'may',
													data : 'may'
												},
												{
													name : 'jun',
													data : 'jun'
												},
												{
													name : 'jul',
													data : 'jul'
												},
												{
													name : 'aug',
													data : 'aug'
												},
												{
													name : 'sep',
													data : 'sep'
												},
												{
													name : 'oct',
													data : 'oct'
												},
												{
													name : 'nov',
													data : 'nov'
												},
												{
													name : 'dec',
													data : 'dec'
												},
												{
													data : "",
													defaultContent : '',
													sortable : false,
													'class' : 'text-center',
													render : function(data,
															type, row, meta) {
														return ('<div class="btn-group">'
																+ '<a class="btn btn-default btn-xs del" title="删除" href="#"><i class="fa fa-trash-o"></i></a>'
																+ '</div>'
																+ '&nbsp;&nbsp;');
													}
												} ]
									});

					table.on('click', '.del', function() {
						var id = table.row($(this).parents('tr')).data().id;
						$("#delForm #ids").val(id);
						if (id) {
							bootbox.confirm("确定要删除数据吗?", function(result) {
								if (result) {
									$("#delForm").submit();
								}
							});
						}
					});
					$(".btn.delAll").on("click", function(e) {
						var ids = [];
						$('#table>tbody input:checked').each(function(i, item) {
							ids.push($(item).val());
						});
						$("#delForm #ids").val(ids.join(","));
						if (ids.length > 0) {
							bootbox.confirm("确定要删除选中的数据吗?", function(result) {
								if (result) {
									$("#delForm").submit();
								}
							});
						} else {
							bootbox.alert("请选择要删除的数据.");
						}
					});

					$('.search-form').on(
							"submit",
							function(e) {
								var no = $('.search-form').find(
										'input[name="no"]').val();
								// var sapPlantNo =
								// $('.search-form').find('input[name="sapPlantNo"]').val();
								var name = $('.search-form').find(
										'input[name="name"]').val();
								table.column('no:name').search(no);
								// table.column('sapPlantNo:name').search(sapPlantNo);
								table.column('name:name').search(name);
								table.draw();
								// 阻止表单submit
								return false;
							});

				});
