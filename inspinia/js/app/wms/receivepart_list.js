$(document).ready(function () {
	//打开界面时，搜索框获得焦点
	$('.search-form').find('input#no').focus();

  var table = $('table#table').DataTable({
	responsive: true,
    ajax: {
    	url:baseUrl + '/datatable',
    	data: {
    		receiveId: receiveId
    	}
    },
    order: [
      [1, 'asc']
    ],
    columns: [
	{data: 'receive.id', name : 'receive', defaultContent : '', visible : false}, 
	{
		data: 'id',
		sortable: false,
		defaultContent: '',
		'class': 'text-center',
		render: function (data, type, row, meta) {
		  return '<div class="checkbox"><input type="checkbox" name="ids" value="' + data + '"/><label for="ids"/></div>'
		}
	},
	{data: 'linenumber', name: 'linenumber', visible: false}, 
    {data: 'part.no', name: 'partNo',defaultContent: '', 'class': 'text-center'}, 
    {data: 'part.name', name: 'partNameC',defaultContent: '', 'class': 'text-center'}, 
    {data: 'requiredQty', name: 'requiredQty', 'class': 'text-center'}, 
    {data: 'receiveQty', name: 'receiveQty', 'class': 'text-center'}, 
    {data: 'pack.no', name: 'packageNo',defaultContent: '', 'class': 'text-center'}, 
    {data: 'pQty', name: 'pQty', 'class': 'text-center'}, 
    {data: 'reqBoxNum', name: 'reqBoxNum', 'class': 'text-center'}, 
    {data: 'recBoxNum', name: 'recBoxNum', 'class': 'text-center'}, 
    {
      data: "",
      defaultContent: '',
      sortable: false,
      'class': 'text-center',
      render: function (data, type, row, meta) {
          var div = "";
          if ((billType == '90' || billType == '98' || billType == '20' || billType == '80') && status == '1') {
        	  div = '<div class="btn-group">' +
                      '<a class="btn btn-default btn-xs" title="修改" href="' + baseUrl + '/edit/' + row.id + '"><i class="fa fa-edit"></i></a>' +
                      '<a class="btn btn-default btn-xs del" title="删除" href="#"><i class="fa fa-trash-o"></i></a>' +
                      '</div>' +
                      '&nbsp;&nbsp;';
          }
          return div;
      }
    },
    {data: 'customerNo', name: 'customerNo',defaultContent: '', 'class': 'text-center'}]
  });
  
  table.on('click', '.del', function () {
    var id = table.row($(this).parents('tr')).data().id;
    $("#delForm #ids").val(id);
    if (id) {
      bootbox.confirm("确定要删除数据吗?", function (result) {
        if (result) {
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
  
  /**
   * 扫描，后面需要回车触发事件
   */
  $('.search-form').on("submit", function (e) {
    var no = $('.search-form').find('input#no').val();
    //根据单号查询主数据
    $.ajax({
    	url: baseUrl + '/find/sdsNo?sdsNo=' + no,
    	type: 'get',
    	success: function(data){
    		if(data){
    			$("#sdsNo").html(data.sdsNo);
    			if(data.status){
    				if(data.status == '1'){
    					$("#status").html('新单');		
    				}else if(data.status = '2'){
    					$("#status").html('发布');
    				}else if(data.status = '3'){
    					$("#status").html('供应商反馈');
    				}else if(data.status = '4'){
    					$("#status").html('部份接收');
    				}else if(data.status = '5'){
    					$("#status").html('道口接收');
    				}else if(data.status = '6'){
    					$("#status").html('关闭');
    				}
    			}
    			if(data.sdsType){
    				if(data.sdsType = 'EL'){
    					$("#sdsType").html('正常');
    				}else if(data.sdsType = 'SEP'){
    					$("#sdsType").html('紧急');
    				}
    			}
    			
    			$("#dockNo").html(data.dockNo);
    			$("#requiredTime").html(data.requiredTime);
    			$("#issuesTime").html(data.issuesTime);
    			$("#supplNo").html(data.supplNo);
    			$("#billVersion").html(data.billVersion);
    			$("#shipper").html(data.shipper);
    			$("#recCompany").html(data.recCompany);
    			$("#shipperTel").html(data.shipperTel);
    			$("#receiver").html(data.receiver);
    			$("#receiverTel").html(data.receiverTel);
    			
    			//查询子表，根据主表ID
    		    table.column('receive.id:name').search(data.id);
    		    table.draw();
    		    
    		    $('#mainId').val(data.id);
    		    //清空查询条件，条件框获得焦点
    			$('.search-form').find('input#no').val('');
    			$('.search-form').find('input#no').focus();
    		}else{
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
    			
    			//清除子表数据
    			table.column('receive.id:name').search(null);
    			table.clear().draw();
    			$('#mainId').val('');
    			bootbox.alert('该条码无法识别');
    			//清空查询条件，条件框获得焦点
    			$('.search-form').find('input#no').val('');
    			$('.search-form').find('input#no').focus();
    		}
    	} 
    });
    return false;
  });
});
