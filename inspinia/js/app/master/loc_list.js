$(document).ready(
		function() {
			// initializing select2
			// link select2 controls
			// 库区联动于仓库
			$("#warehouse").select2({
				ajax : {
					url : rootUrl + "/api/master/warehouses"
				}
			});
			$("#dloc").linkSelect2("warehouse", rootUrl + "/api/master/dlocs", "warehouse");
			var table = $('table#table').DataTable(
					{
						ajax : baseUrl + '/datatable',
						order : [ [ 2, 'asc' ] ],
						searchCols : [ {
							search : dloc
						} ],
						columns : [
								{
									name : 'dloc',
									data : 'dloc.id',
									visible : false
								},
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
									name : 'warehouse.no',
									data : 'warehouse.no',
									render : function(data, type, row, meta) {
										return data + "-" + row.warehouse.name;
									}
								},
								{
									name : 'warehouse.name',
									data : 'warehouse.name',
									visible : false
								},
								{
									name : 'dloc.no',
									data : 'dloc.no',
									render : function(data, type, row, meta) {
										return data + "-" + row.dloc.name;
									}
								},
								{
									name : 'dloc.name',
									data : 'dloc.name',
									visible : false
								},
								{
									name : 'no',
									data : 'no'
								},
								{
									name : 'name',
									data : 'name'
								},
								{
									data : 'lane'
								},
								{
									data : 'rank'
								},
								{
									data : 'level'
								},
								{
									data : 'plat'
								},
								{
									data : 'type',
									render : function(data, type, row, meta) {
										return VALUES_MAP_DICT_TYPE && VALUES_MAP_DICT_TYPE[data] ? VALUES_MAP_DICT_TYPE[data].text : '';
									}
								},
								{
									data : "allowMixingBatch",
									defaultContent : '',
									sortable : false,
									'class' : 'text-center',
									render : function(data, type, row, meta) {
										var result = '<a class="btn btn-xs btn-default allowMixingBatch" href="javascript:;">';
										if (data) {
											result += '<i title="允许/不允许" class="fa fa-check-square-o"/>';
										} else {
											result += '<i title="允许/不允许" class="fa fa-square-o"/>';
										}
										result += '</a>';
										return result;
									}
								},
								{
									data : "allowMixingPart",
									defaultContent : '',
									sortable : false,
									'class' : 'text-center',
									render : function(data, type, row, meta) {
										var result = '<a class="btn btn-xs btn-default allowMixingPart" href="javascript:;">';
										if (data) {
											result += '<i title="允许/不允许" class="fa fa-check-square-o"/>';
										} else {
											result += '<i title="允许/不允许" class="fa fa-square-o"/>';
										}
										result += '</a>';
										return result;
									}
								}
								/*
								 * , { data: 'lastModifiedDate', 'class':
								 * 'text-center', defaultContent: '' }
								 */
								,
								{
									data : "enabled",
									defaultContent : '',
									sortable : false,
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
								}, {
									name : 'warehouse',
									data : 'warehouse.id',
									visible : false
								}, {
									name : 'type',
									data : 'type',
									visible : false
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

			table.on('click', '.allowMixingBatch', function() {
				var that = this;
				var data = table.row($(this).parents('tr')).data();
				var id = data.id;
				var enabled = data.allowMixingBatch;
				$.get(baseUrl + "/allowMixingBatch", {
					enabled : !enabled,
					ids : id
				}, function(res) {
					if (res) {
						data.allowMixingBatch = !enabled;
						$(that).find("i").removeClass("fa-" + (enabled ? "check-" : "") + "square-o").addClass("fa-" + (!enabled ? "check-" : "") + "square-o");
						toastr.info('操作成功!');
					}

				});
			});

			table.on('click', '.allowMixingPart', function() {
				var that = this;
				var data = table.row($(this).parents('tr')).data();
				var id = data.id;
				var enabled = data.allowMixingPart;
				$.get(baseUrl + "/allowMixingPart", {
					enabled : !enabled,
					ids : id
				}, function(res) {
					if (res) {
						data.allowMixingPart = !enabled;
						$(that).find("i").removeClass("fa-" + (enabled ? "check-" : "") + "square-o").addClass("fa-" + (!enabled ? "check-" : "") + "square-o");
						toastr.info('操作成功!');
					}

				});
			});
			$('.search-form').on("submit", function(e) {
				// $(this).find(":submit.btn-loading").ladda('start');
				e.preventDefault();
				var warehouseId = $('.search-form').find('select[name="warehouse"]').val();
				console.log("search form warhouse ", warehouseId);
				var dlocId = $('.search-form').find('select[name="dloc"]').val();
				var type = $('.search-form').find('select[name="type"]').val();
				var no = $('.search-form').find('input[name="no"]').val();
				if (!warehouseId)
					warehouseId = warehouse;
				if (!dlocId)
					dlocId = dloc;
				console.log(warehouse, dloc, type, no);
				table.column('warehouse:name').search(warehouseId);
				table.column('dloc:name').search(dlocId);
				table.column('type:name').search(type);
				table.column('no:name').search(no);
				table.clear().draw();
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
