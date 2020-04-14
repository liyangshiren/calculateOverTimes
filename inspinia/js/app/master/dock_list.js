$(document).ready(
		function() {
			var table = $('table#table').DataTable(
					{
						scrollX: true,
						autoWidth: true,
						ajax : baseUrl + '/datatable',
						order : [ [ 5, 'asc' ] ],
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
									name : 'plant',
									data : 'plant.no',
									defaultContent : ''
								},
								/*{
									name : 'warehouse',
									data : 'warehouse.id',
									defaultContent : '',
									visible : false
								},
								{
									data : 'warehouse',
									defaultContent : '',
									'class' : 'text-center',
									render : function(data, type, row, meta) {
										return data ? (data.no + '-' + data.name) : ''; 
									}
								},
								{
									name : 'warehouse',
									data : 'warehouse.name',
									defaultContent : '',
									visible : false
								},*/
								{
									name : 'no',
									data : 'no'
								},
								{
									name : 'name',
									data : 'name',
									render : function(data, type, row, meta) {
										if(data == null)
											return "";
										return '<div id="a" style="width:100px;overflow: hidden;text-overflow: ellipsis;" title="' + data + '">' + data + '</div>';
									}
								},
								{
									name : 'type',
									data : 'type',
									visible : false
								},
								{
									data : 'type',
									render : function(data, type, row, meta) {
										return VALUES_MAP_DICT_TYPE && VALUES_MAP_DICT_TYPE[data] ? VALUES_MAP_DICT_TYPE[data].text : '';
									}
								},
								{
									name : 'contactName',
									data : 'contactName',
									defaultContent : ''
								},
								{
									name : 'contactPhone',
									data : 'contactPhone',
									defaultContent : ''
								},
								{
									name : 'contactAddr',
									data : 'contactAddr',
									defaultContent : '',
//									render : function(data, type, row, meta) {
//										if(!data) return '';
//										return '<div id="a" style="width:78px;overflow: hidden;text-overflow: ellipsis;" title="' + data + '">' + data + '</div>';
//										;
//									}
								},
								{
									name : 'description',
									data : 'description',
									defaultContent : '',
//									render : function(data, type, row, meta) {
//										if(!data) return '';
//										return '<div id="a" style="width:118px;overflow: hidden;text-overflow: ellipsis;" title="' + data + '">' + data + '</div>';
//										;
//									}
								},
								{
									data : "enabled",
									defaultContent : '',
									'class' : 'text-center',
									render : function(data, type, row, meta) {
										var result = '<a class="btn btn-xs btn-default enable" href="javascript:;">';
										if (data) {
											result += '<i title="激活/禁用" class="fa fa-check-square-o"/>';
										} else {
											result += '<i title="激活/禁用" class="fa fa-square-o"/>';
										}
										result += '</a>';
										return result;
									}
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
								},
								{
									data : "warehouse.id",
									name : "warehouse",
									defaultContent : '',
									visible : false
								}
								]
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

			table.on('click', '.enable', function() {
				var that = this;
				var data = table.row($(this).parents('tr')).data();
				var id = data.id;
				var enabled = data.enabled;
				$.get(baseUrl + "/enable", {
					enabled : !enabled,
					ids : id
				}, function(res) {
					if (res) {
						data.enabled = !enabled;
						$(that).find("i").removeClass("fa-" + (enabled ? "check-" : "") + "square-o").addClass("fa-" + (!enabled ? "check-" : "") + "square-o");
						toastr.info('操作成功!');
					}

				});
			});

			$('#search').on("click", function(e) {
//				var warehouse = $('.search-form').find('select[name="warehouse"]').val();
				var no = $('.search-form').find('input[name="no"]').val();
				var name = $('.search-form').find('input[name="name"]').val();
				// var type =
				// $('.search-form').find('select[name="type"]').val();
//				console.log(warehouse, no, name);
//				table.column('warehouse:name').search(warehouse).column('no:name').search(no).column('name:name').search(name)
				table.column('no:name').search(no).column('name:name').search(name)
				// .column('type:name').search(type)
				.draw();
				// 阻止表单submit
				return false;
			});
			
			//导出 动态组织form提交
			  $(".btn.export").on("click", function (e) {
				$("#exportForm .param").remove();
				var $frm = $("#exportForm");
			　　　var array = $('.search-form').serializeArray();
			　　　for (i = 0, length = array.length; i < length; i++) {
				　　　key = array[i].name;
					value = array[i].value;
					$frm.append($('<input class="param" type="hidden" name = "' + key + '" value = "' + value + '" />')); 
				}
				var params = table.ajax.params();
				$frm.append($('<input class="param" type="hidden" name="input" value = \'' + JSON.stringify(params) + '\' />')); 
				$frm.submit();
				// 阻止默认行为
				e.preventDefault();
				return false;  
			  });
			  
		});
