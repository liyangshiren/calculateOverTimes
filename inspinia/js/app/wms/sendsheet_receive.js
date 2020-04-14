$(document).ready(function () {
  //打开界面时，搜索框获得焦点
  $('.search-form').find('input#no').focus();
	
  var table = $('table#table').DataTable({
	responsive: true,
    ajax: baseUrl + '/partDatatable',
    order: [
      [0, 'asc']
    ],
    columns: [
	{data: 'partNo', name: 'partNo', 'class': 'text-center', defaultContent: ''}, 
	{data: 'partName', name: 'partName', 'class': 'text-center', defaultContent: ''}, 
	{data: 'sendQty', name: 'qty', 'class': 'text-center', defaultContent: '', orderable:false},// 从两个表取的数据，字段名不一样不做排序
    {data: 'barcode', name: 'barcode', 'class': 'text-center', defaultContent: ''}, 
    {data: 'supplNo', name: 'supplNo', 'class': 'text-center', defaultContent: ''}, 
    {data: 'packNo', name: 'packNo', 'class': 'text-center', defaultContent: ''}, 
    {data: 'pQty', name: 'pQty', 'class': 'text-center', defaultContent: ''}
    ]
  });
  
  /**
   * 扫描，后面需要回车触发事件
   */
  $('.search-form').on("submit", function (e) {
    var no = $('.search-form').find('input#no').val();
    if(!no){
    	toastr.warning('请扫描单号', '提示信息!');
    	$('.search-form').find('input#no').val('');
		$('.search-form').find('input#no').focus();
    	return false;
    }
    //根据单号查询主数据
    $.ajax({
    	url: baseUrl + '/scanNo?no=' + no,
    	type: 'get',
    	success: function(data){
    		if(data){
    			//未维护人员道口关系
      			if(!data.success){
    				$('.search-form').find('input#no').focus();
    				$('.search-form').find('input#no').select();
    				$('#mainInfo span').html('');
        			$('#mainId').val('');
        			$('#scanType').val('');
        			table.ajax.url(baseUrl + '/partDatatable').load();
        			toastr.warning(data.message, '提示信息!');
      				return;
      			}
      			if (data.value) {
//      				var bl = true;
      				if(data.message){
//      					bl = confirm(data.message);
      					$("#receive").val(data.message);
      				}/*
      				if(!bl){
      					$('.search-form').find('input#no').focus();
        				$('.search-form').find('input#no').select();
      					return;
      				}*/
      				var sheet = data.value;
      				$("#sheetNo").html(sheet.sheetNo);
  					$("#sendTime").html(sheet.sendTime);
  					$("#dock").html(sheet.dockNo);
  					$("#businessNo").html(sheet.businessNo);
  					var sheetTypeName = VALUES_MAP_DICT_TYPE && VALUES_MAP_DICT_TYPE[sheet.sheetType] ? VALUES_MAP_DICT_TYPE[sheet.sheetType].text : '';
  					$("#sheetType").html(sheetTypeName);
  					var statusName = VALUES_MAP_DICT_STATUS && VALUES_MAP_DICT_STATUS[sheet.status] ? VALUES_MAP_DICT_STATUS[sheet.status].text : '';
  					$("#status").html(statusName);
      				
      				//查询子表，根据主表ID
      				table.ajax.url(baseUrl + '/partDatatable?mainId=' + sheet.id + "&scanType=" + sheet.scanType).load();
      				
      				$('#mainId').val(sheet.id);
      				$('#scanType').val(sheet.scanType);
      				//清空查询条件，条件框获得焦点
      				$('.search-form').find('input#no').focus();
    				$('.search-form').find('input#no').select();
      			}
    		} else {
    			$('#mainInfo span').html('');
    			$('#mainId').val('');
    			$('#scanType').val('');
    			table.ajax.url(baseUrl + '/partDatatable').load();
    			
    			toastr.warning('该条码无法识别', '提示信息!');
    			//清空查询条件，条件框获得焦点
    			$('.search-form').find('input#no').val('');
    			$('.search-form').find('input#no').focus();
    		}
    	} 
    });
    return false;
  });
  
  /**
   * 取消，清除数据
   */
  $('#cancel').on("click", function (e) {
	  $('#mainInfo span').html('');
	  $('#mainId').val('');
	  $('#scanType').val('');
	  
	  //清除子表数据
	  table.ajax.url(baseUrl + '/partDatatable').load();
  });
  
  /**
   * 收货
   */
  $("#receive").on('click', function(){
	  var msg = $(this).val();
	  if (msg) {
		  if (!confirm(msg)) {
			  $('.search-form').find('input#no').focus();
			  $('.search-form').find('input#no').select();
			  return;
		  }
	  }
	  var mainId = $('#mainId').val();
	  if(!mainId){
		  toastr.warning('请先扫描单号', '提示信息!');
		  return;
	  }
	  //页面去除车辆号由于跟APP是公用方法默认给个空值
//	  var vehicleNo = "";
	  /*if(!vehicleNo){
		  toastr.warning('请输入车辆号', '提示信息!');
		  return;
	  }*/
	  window.location.href = baseUrl + '/receive/'+ mainId;
  });
  
  var no = $("#no").val();
  if(no){
	  $('.search-form').submit();
  }
  
});
