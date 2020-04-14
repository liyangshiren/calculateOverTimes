$(document).ready(function() {
	// 打开界面时，搜索框获得焦点
	$('.search-form').find('input#no').focus();
	var table = $('table#table').DataTable({
		responsive : true,
		ajax : baseUrl + '/partDatatable',
		order : [ [ 0, 'asc' ] ],
		columns : [ {
			data : 'lineNumber',
			name : 'lineNumber',
			'class' : 'text-center',
			defaultContent : ''
		}, {
			data : 'part.no',
			name : 'partNo',
			'class' : 'text-center',
			defaultContent : ''
		}, {
			data : 'part.name',
			name : 'partName',
			'class' : 'text-center',
			defaultContent : ''
		}, {
			data : 'reqQty',
			name : 'reqQty',
			'class' : 'text-center',
			defaultContent : ''
		}, {
			data : 'shipQty',
			name : 'shipQty',
			'class' : 'text-center',
			defaultContent : ''
		}, {
			data : 'baseUnit',
			name : 'baseUnit',
			'class' : 'text-center',
			defaultContent : ''
		}, {
			data : 'barcode',
			name : 'barcode',
			'class' : 'text-center',
			defaultContent : ''
		}, {
			data : 'dockRecFlag',
			name : 'dockRecFlag',
			'class' : 'text-center',
			defaultContent : ''
		},]
	});

	function findByNo(no, number) {
		// 根据单号查询主数据
		$.ajax({
			url : baseUrl + '/find/sheetNo?sheetNo=' + no,
			type : 'get',
			success : function(data) {
				if (data) {
					$("#sheetNo").html(data.sheetNo ? data.sheetNo : '&nbsp;');
					if (data.sheetStatus) {
						if (data.sheetStatus == '1') {
							$("#sheetStatus").html('新单');
						} else if (data.sheetStatus == '2') {
							$("#sheetStatus").html('发布');
						} else if (data.sheetStatus == '5') {
							$("#sheetStatus").html('供应商发运');
						} else if (data.sheetStatus == '9') {
							$("#sheetStatus").html('已拣货');
						} else if (data.sheetStatus == '11') {
							$("#sheetStatus").html('已发货');
						} else if (data.sheetStatus == '18') {
							$("#sheetStatus").html('道口部分发货');
						} else if (data.sheetStatus == '6') {
							$("#sheetStatus").html('道口收货');
						} else if (data.sheetStatus == '15') {
							$("#sheetStatus").html('道口部分收货');
						} else if (data.sheetStatus == '12') {
							$("#sheetStatus").html('线边收货');
						} else if (data.sheetStatus == '25') {
							$("#sheetStatus").html('线边部分收货');
						} else if (data.sheetStatus == '14') {
							$("#sheetStatus").html('关闭');
						} else if (data.sheetStatus == '26') {
							$("#sheetStatus").html('上线中');
						}else{
							$("#sheetStatus").html('&nbsp;');
						}
					}
					$("#shipBillNo").html(data.shipBillNo ? data.shipBillNo : '&nbsp;');

					// $("#sheetStatus").html(data.sheetStatus ? data.sheetStatus : '&nbsp;');
					$("#shipTime").html(data.shipTime ? data.shipTime : '&nbsp;');
					$("#sapAreaCode").html(data.sapAreaCode ? data.sapAreaCode : '&nbsp;');

					// 查询子表，根据主表ID
					table.ajax.url(baseUrl + '/partDatatable?crpShipId=' + data.id).load();

					$('#mainId').val(data.id);
					// 清空查询条件，条件框获得焦点
					$('.search-form').find('input#no').val('');
					$('.search-form').find('input#no').focus();
				} else {
					$("#sheetNo").html('');
					$("#shipBillNo").html('');
					$("#sheetStatus").html('');
					$("#shipTime").html('');

					$('#mainId').val('');
					table.ajax.url(baseUrl + '/partDatatable').load();

					alert('该条码无法识别');
					// 清空查询条件，条件框获得焦点
					$('.search-form').find('input#no').val('');
					$('.search-form').find('input#no').focus();
				}
			}
		});

	}

	/**
	 * 扫描，后面需要回车触发事件
	 */
	$('.search-form').on("submit", function(e) {
		var no = $('.search-form').find('input#no').val();
		if (!no) {
			alert('请扫描单号');
			$('.search-form').find('input#no').val('');
			$('.search-form').find('input#no').focus();
			return false;
		}
		findByNo(no,0);

		return false;
	});

	/**
	 * 取消，清除数据
	 */
	$('#cancel').on("click", function(e) {
		$("#sheetNo").html('');
		$("#shipBillNo").html('');
		$("#sheetStatus").html('');
		$("#shipTime").html('');

		table.ajax.url(baseUrl + '/partDatatable').load();
		$('#mainId').val('');
	});

	/**
	 * 收货
	 */
	$("#receive").on('click', function() {
		var mainId = $('#mainId').val();
		if (!mainId) {
			bootbox.alert('请先扫描单号');
			return;
		}
		var sheetNo = $("#sheetNo").html()
		window.location.href = baseUrl + '/part?sheetNo=' + sheetNo;
	});
	var no = $("#no").val();
	if(no){
		findByNo(no,1);
	}

});
