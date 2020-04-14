$(document)
		.ready(
				function() {
					var table = $('table#table')
							.DataTable(
									$
											.extend({
												scrollX : true
											},
													{
														ajax : {
															url : baseUrl + '/datatable',
															data : function(d) {
																var templateName = $('.search-form').find('input[name="templateName"]').val();
																d.templateName = templateName;
																return d;
															}
														},
														order : [ [ 2, 'asc' ] ],
														columns : [
																{
																	data : 'id',
																	sortable : false,
																	defaultContent : '',
																	'class' : 'text-center',
																	render : function(data, type, row, meta) {
																		return '<div class="checkbox"><input type="checkbox" name="ids" value="' + data
																				+ '"/><label for="ids"/></div>'
																	}
																},
																{
																	data : 'templateName',
																	render : function(data, type, row, meta) {
																		return VALUES_MAP_DICT_TYPE && VALUES_MAP_DICT_TYPE[data] ? VALUES_MAP_DICT_TYPE[data].text : '';
																	},
																	defaultContent : ''
																},
																{
																	data : 'printConf.printerNickName',
																	name : 'printConf.printerNickName',
																	defaultContent : ''
																},
																{
																	data : 'sheetType',
																	name : 'sheetType',
																	'class' : 'text-center',
																	defaultContent : ''
																},
																{
																	data : 'condition',
																	name : 'condition',
																	'class' : 'text-center',
																	defaultContent : ''
																},
																{
																	data : 'copies',
																	name : 'copies',
																	'class' : 'text-center',
																	defaultContent : ''
																},
																{
																	data : 'runInterval',
																	name : 'runInterval',
																	'class' : 'text-center',
																	defaultContent : ''
																},
																{
																	data : 'creater',
																	name : 'creater',
																	'class' : 'text-center',
																	defaultContent : ''
																},
																{
																	data : "",
																	defaultContent : '',
																	sortable : false,
																	'class' : 'text-center',
																	render : function(data, type, row, meta) {
																		return ('<div class="btn-group">' + '<a class="btn btn-default btn-xs" title="打印任务查询" href="' + baseUrl
																				+ '/findDetail/' + row.id + '"><i class="fa fa-list"></i></a>&nbsp;&nbsp;');
																	}
																},
																{
																	data : "",
																	defaultContent : '',
																	sortable : false,
																	'class' : 'text-center',
																	render : function(data, type, row, meta) {
																		return ('<div class="btn-group">' + '<a class="btn btn-default btn-xs" title="修改" href="' + baseUrl
																				+ '/edit/' + row.id + '"><i class="fa fa-edit"></i></a>'
																				+ '<a class="btn btn-default btn-xs del" title="删除" href="#"><i class="fa fa-trash-o"></i></a>'
																				+ '</div>' + '&nbsp;&nbsp;');
																	}
																} ]
													}));

					$('.search-form').on("submit", function(e) {
						var templateName = $('.search-form').find('input[name="templateName"]').val();
						table.column('templateName:name').search(templateName);
						e.preventDefault();
						table.draw();
						// 阻止表单submit
						return false;
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

					$('#clear').on("click", function(e) {
						table.columns().search('').draw();
					});
				});