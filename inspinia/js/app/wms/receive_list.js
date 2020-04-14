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
    {data: 'linenumber', name: 'linenumber', visible: false},
    // {data: 'receive.id', name: 'receive.id', visible: false},
    {data: 'part.no', name: 'partNo', 'class': 'text-center'},
    {data: 'part.name', name: 'partNameC', 'class': 'text-center'},
    {data: 'requiredQty', name: 'requiredQty', 'class': 'text-center'},
    {data: 'receiveQty', name: 'receiveQty', 'class': 'text-center'},
    {data: 'pack.no', name: 'packageNo', 'class': 'text-center'},
    {data: 'pQty', name: 'pQty', 'class': 'text-center'},
    {data: 'reqBoxNum', name: 'reqBoxNum', 'class': 'text-center'},
    {data: 'recBoxNum', name: 'recBoxNum', 'class': 'text-center'}]
  });

  /**
   * 扫描，后面需要回车触发事件
   */
  $('.search-form').on("submit", function (e) {
    var no = $('.search-form').find('input#no').val();
    if(!no){
    	alert('请扫描单号');
    	return false;
    }
    findByNo(no, 0);
    return false;
  });
  
  function findByNo(no, type){
	  $.get(baseUrl + '/find/sdsNo?type='+ type +'&sdsNo=' + no, function(data){
	  		if(data){
	  			if(data.msgType == '0' && data.msg){
	  				toastr.info(data.msg);
	  				$('#mainId').val('');
	  				$('.search-form').find('input#no').focus();
	  				setNull();
					table.ajax.url(baseUrl + '/partDatatable').load();
	  				return;
	  			}
	  			if(data.msgType == '1'){
	  				var bl = true;
	  				if(data.msg){
	  					bl = confirm(data.msg);
	  				}
	  				if(!bl){
	  					$('.search-form').find('input#no').val('');
	  					$('.search-form').find('input#no').focus();
	  					return;
	  				}
	  				
	  				$("#sdsNo").html(data.sdsNo);
	  				if(data.status){
	  					if(data.status == '1'){
	  						$("#status").html('新单');
	  					}else if(data.status == '2'){
	  						$("#status").html('发布');
	  					}else if(data.status == '4'){
	  						$("#status").html('供应商反馈');
	  					}else if(data.status == '15'){
	  						$("#status").html('道口部分收货');
	  					}else if(data.status == '6'){
	  						$("#status").html('道口接收');
	  					}else if(data.status == '14'){
	  						$("#status").html('已关闭');
	  					}else if(data.status == '16'){
	  						$("#status").html('已删除');
	  					}
	  				}
	  				if(data.billType){
	  					if(data.billType == '7'){
	  						$("#billType").html('PUS');
	  					}else if(data.billType == '98'){
	  						$("#billType").html('寄售');
	  					}else if(data.billType == '90'){
	  						$("#billType").html('白条');
	  					}else if(data.billType == '80'){
	  						$("#billType").html('自建');
	  					}
	  				}

	  				$("#dockNo").html(data.dock ? data.dock.no : '&nbsp;');
	  				$("#requiredTime").html(data.requiredTime);
	  				$("#issuesTime").html(data.issuesTime);
	  				$("#supplNo").html(data.suppl ? data.suppl.no : '&nbsp;');
	  				$("#billVersion").html(data.billVersion);
	  				$("#shipper").html(data.shipper ? data.shipper : '&nbsp;');
	  				$("#recCompany").html(data.recCompany ? data.recCompany : '&nbsp;');
	  				$("#shipperTel").html(data.shipperTel ? data.shipperTel : '&nbsp;');
	  				$("#receiver").html(data.receiver ? data.receiver : '&nbsp;');
	  				$("#receiverTel").html(data.receiverTel ? data.receiverTel : '&nbsp;');

	  				$('#mainId').val(data.id);
	  				//查询子表，根据主表ID
	  	          // table.column('receive.id:name').search(data.id);
	  				table.ajax.url(baseUrl + '/partDatatable?receiveId=' + data.id).load();
	  			    //清空查询条件，条件框获得焦点
	  				$('.search-form').find('input#no').val('');
	  				$('.search-form').find('input#no').focus();
	  			}
			}else{
				setNull();
				//清除子表数据
				// table.column('receive.id:name').search(null);
				$('#mainId').val('');
				table.ajax.url(baseUrl + '/partDatatable').load();
				alert('该条码无法识别');
				//清空查询条件，条件框获得焦点
				$('.search-form').find('input#no').val('');
				$('.search-form').find('input#no').focus();
			}
		})
	  }

  function setNull(){
	    $("#sdsNo").html('');
		$("#status").html('');
		$("#sdsType").html('');
		$("#dockNo").html('');
		$("#requiredTime").html('');
		$("#issuesTime").html('');
		$("#supplNo").html('');
		$("#billVersion").html('');
		$("#shipper").html('');
		$("#recCompany").html('');
		$("#shipperTel").html('');
		$("#receiver").html('');
		$("#receiverTel").html('');
  }
  
  /**
   * 收货
   */
  $('#receive').on("click", function (e) {
	  var mainId = $('#mainId').val();
	  if(!mainId){
		  toastr.warning('请先扫描单号', '提示信息!');
		  return;
	  }
	  var sdsNo = $("#sdsNo").html();
	  window.location.href = baseUrl + '/part?sdsNo=' + sdsNo;
  });
  
  var no = $("#no").val();
  if(no){
	  findByNo(no, 1);
  }
  
});
