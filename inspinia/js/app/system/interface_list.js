$(document).ready(
		function() {
			var table = $('table#table').DataTable(
					{
						ajax : {
							url : baseUrl + '/datatable',
							data : function(d) {
								var interfaceId = $('.search-form').find('select[name="interfaceId"]').find("option:selected").text();
								var sendSystem = $('.search-form').find('select[name="sendSystem"]').find("option:selected").text();
								var receiveSystem = $('.search-form').find('select[name="receiveSystem"]').find("option:selected").text();
								d.interfaceId = interfaceId;
								d.sendSystem = sendSystem;
								d.receiveSystem = receiveSystem;
								return d;
							}
						},
						order : [ [ 2, 'asc' ], [ 3, 'asc' ] ],
						columns : [
								{
									data : 'interfaceId',
									name : 'interfaceId',
									defaultContent : '',
								},
								{
									data : 'interfaceDesc',
									'class' : 'interfaceDesc',
									defaultContent : ''
								},
								{
									data : 'interfaceComm',
									name : 'interfaceComm',
									defaultContent : ''
								},
								{
									data : 'sendSystem',
									name : 'sendSystem',
									'class' : 'text-center',
									defaultContent : ''
								},
								{
									data : 'receiveSystem',
									name : 'receiveSystem',
									defaultContent : ''
								},
								{
									data : 'lastRequestId',
									name : 'lastRequestId',
									defaultContent : ''
								},
								{
									data : 'io',
									name : 'io',
									render : function(data, type, row, meta) {
										if (data == "I") {
											return "接收数据";
										} else {
											return "发送数据";
										}
									},
									defaultContent : ''
								},
								{
									data : "",
									defaultContent : '',
									sortable : false,
									'class' : 'text-center',
									render : function(data, type, row, meta) {
										return ('<div class="btn-group">' + '<a class="btn btn-default btn-xs" title="查看明细" href="' + rootUrl + '/system/interfaceMsg/' + row.id
												+ '"><i class="fa fa-list"></i></a>' + '&nbsp;&nbsp;');
									}
								} ]
					});

			$('.search-form').on("submit", function(e) {
				e.preventDefault();
				table.draw();
				return false;
			});

			$('#clear').on("click", function(e) {
				$("#interfaceId").val('').trigger("change");
				table.columns().search('').draw();
			});

			$("#interfaceId").select2({
				ajax : {
					url : rootUrl + "/api/system/interfaces",
					data : function(params) {
						params.q = params.term;
						return params;
					}
				}
			});
		})