$(document).ready(
		function() {
			var table = $('table#table').DataTable(
					{
						ajax : {
							url : baseUrl + '/datatable',
							data : function(d) {
								var printerFullName = $('.search-form').find('input#printerFullName').val();
								var printerServiceName = $('.search-form').find('input#printerServiceName').val();
								d.printerFullName = printerFullName;
								d.printerServiceName = printerServiceName;
								return d;
							}
						} ,
						order : [ [ 2, 'asc' ] ],
						columns : [
								{
									data : 'id',
									sortable : false,
									defaultContent : '',
									'class' : 'text-center',
									render : function(data, type, row, meta) {
										return '<div class="checkbox"><input type="checkbox" name="ids" value="' + data + '"/><label for="ids"/></div>'
									}
								},
								{
									data : 'printerNickName',
									name : 'printerNickName',
									'class' : 'text-center',
									defaultContent : ''
								},
								{
									data : 'printerFullName',
									name : 'printerFullName',
									'class' : 'text-center',
									defaultContent : ''
								},
								{
									data : 'printerStatus',
									name : 'printerStatus',
									'class' : 'text-center',
									render : function(data, type, row, meta) {
										var result = '<a class="btn btn-xs btn-default printerStatus" href="javascript:;">';
										if (data) {
											result += '<i title="可用/非可用标识" class="fa fa-check-square-o"/>';
										} else {
											result += '<i title="可用/非可用标识" class="fa fa-square-o"/>';
										}
										result += '</a>';
										return result;
									}
								},
								{
									data : 'isExternal',
									name : 'isExternal',
									'class' : 'text-center',
									render : function(data, type, row, meta) {
										return data ? '是' : '否';
									}
								},{
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
										return ('<div class="btn-group">' + '<a class="btn btn-default btn-xs" title="修改" href="' + baseUrl + '/edit/' + row.id
												+ '"><i class="fa fa-edit"></i></a>'
												+ '<a class="btn btn-default btn-xs del" title="删除" href="#"><i class="fa fa-trash-o"></i></a>' + '</div>' + '&nbsp;&nbsp;');
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

			table.on('click', '.printerStatus', function() {
				var that = this;
				var data = table.row($(this).parents('tr')).data();
				var id = data.id;
				var printerStatus = data.printerStatus;
				$.get(baseUrl + "/printerStatus", {
					printerStatus : !printerStatus,
					ids : id
				}, function(res) {
					if (res) {
						data.printerStatus = !printerStatus;
						$(that).find("i").removeClass("fa-" + (printerStatus ? "check-" : "") + "square-o").addClass("fa-" + (!printerStatus ? "check-" : "") + "square-o");
						toastr.info('操作成功!');
					}

				});
			});

			$('.search-form').on("submit", function(e) {
				var printerFullName = $('.search-form').find('input#printerFullName').val();
				var printerServiceName = $('.search-form').find('input#printerServiceName').val();
				table.column('printerFullName:name').search(printerFullName);
				table.column('printerServiceName:name').search(printerServiceName);
				table.draw();
				return false;
			});

			$('#clear').on("click", function(e) {
				table.columns().search('').draw();
			});
		});
