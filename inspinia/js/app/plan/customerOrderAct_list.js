$(document).ready(function () {

// $("#customerOrderNo").inputarea();
	var now = new Date();
	var nowYear = now.getFullYear();
	var nowMounth = now.getMonth() + 1;
	if(nowMounth < 10) {
		nowMounth = "0" + nowMounth;
	}
	var nowDay = now.getDate();
	if(nowDay < 10) {
		nowDay = "0" + nowDay;
	}
	var nowTime = nowYear + '-' + nowMounth + '-' + nowDay;
	var time = new Date().getTime() - 1000*60*60*24*30;
	var timeEndStart = new Date(time).toLocaleDateString().replace(/\//g,'-');
	if(timeEndStart.split('-')[1] < 10) {
		timeEndStart = timeEndStart.split('-')[0] + "-" + "0" + timeEndStart.split('-')[1] + "-" + timeEndStart.split('-')[2];
	}
	if(timeEndStart.split('-')[2] < 10) {
		timeEndStart = timeEndStart.split('-')[0] + "-" + timeEndStart.split('-')[1] + "-" + "0" + timeEndStart.split('-')[2];
	}
	var timeNormal = timeEndStart + " - " + nowTime;
	$('#receivedOrderDate').val(timeNormal) // 给搜索时间赋值
  var table = $('table#table').DataTable({
	  scrollX : true,
	  autoWidth : true,
    ajax : {
		url : baseUrl + '/info',
// type : "POST",
		data : function(d) {
			// 传给后端
			d.customerOrderNo = $("#customerOrderNo").val();
    		d.customerCode = $("#customerCode").val();
    		var receivedOrderDate = $("#receivedOrderDate").val();
    		var requiredConsignmentDate = $("#requiredConsignmentDate").val();
    		d.receivedOrderDate = receivedOrderDate;
    		d.requiredConsignmentDate = requiredConsignmentDate;
    		d.partNo = $("#partNo").val();
    		d.plant = $("#plant").val();
    		return d;
		}
	},
    order: [
      [2, 'asc'],[3, 'asc']
    ],
    columns: [{
      data: 'id',
      sortable: false,
      defaultContent: '',
      'class': 'text-center',
      render: function (data, type, row, meta) {
        return '<div class="checkbox"><input type="checkbox" name="ids" value=""/><label for="ids"/></div>'
      }
    }, 
    {data: 'plant.id',name:'plant', 'class': 'text-center',defaultContent: '', visible : false},
    {data: 'plantNo',name:'plantNo', 'class': 'text-center',defaultContent: ''},
    {data: 'customerCountry',name:'customerCountry','class': 'text-center',defaultContent: ''}, 
    {data: 'customerOrderNo',name:'customerOrderNo','class': 'text-center customerOrderNo',defaultContent: ''}, 
    {data: 'customerCode',name:'customerCode','class': 'text-center',defaultContent: ''}, 
    {data: 'customerName',name:'customerName','class': 'text-center',defaultContent: ''}, 
    {data: 'receivedOrderDate',name:'receivedOrderDate', 'class': 'text-center',defaultContent: ''},
	{data: 'requiredShipDate',name:'requiredShipDate', 'class': 'text-center',defaultContent: ''},
	{data: 'requiredConsignmentDate',name:'requiredConsignmentDate', 'class': 'text-center',defaultContent: ''},
    {data: 'partNo',name:'partNo','class': 'text-center',defaultContent: ''}, 
    {data: 'partName',name:'partName','class': 'text-center',defaultContent: ''}, 
    {data: 'requiredQty',name:'requiredQty','class': 'text-center',defaultContent: ''}, 
    {data: 'receiveQty',name:'receiveQty','class': 'text-center',defaultContent: ''}, 
    {data: 'pQty',name:'pQty','class': 'text-center',defaultContent: ''},
    {data: 'sendQty',name:'sendQty','class': 'text-center',defaultContent: ''},
    ]
  });

  
  
  $('#search').on("click", function (e) {
	  var searchTime = $('#receivedOrderDate').val(); // 判断时间间隔
	  	if(searchTime) {
	  		console.log(searchTime)
	  		var searchStart = searchTime.split(' - ')[0];
		  	var searchEnd = searchTime.split(' - ')[1];
		  	var searchTimeCha = (new Date(searchEnd).getTime() - new Date(searchStart).getTime())/1000/60/60/24;
		  	console.log(searchTimeCha)
		  	if(searchTimeCha > 30) {
		  		bootbox.alert('客户订单执行情况单次查询日期范围最大值为30天！')
		  		return false;
		  	}
	  	}
	  	// input值 在这边set了 上面的ajax data
		// 就不用传给后端了，注意find('【input】（这个地方copy时容易疏忽，有的是【select】）#pickBatchCode')
	  
	    var plant = $('.search-form').find('select#plant').val();
	  
// var customerOrderNo = $('.search-form').find('input#customerOrderNo').val();
// var locNo = $('.search-form').find('select[name="locNo"]').val();
// table.column('customerOrderNo:name').search(customerOrderNo);
// table.column('locNo:name').search(locNo);
	    
	    table.column('plant:name').search(plant);
	    table.draw();
	    
	    // 阻止表单submit
	    return false; 
	  });
  
  $('#clear').on("click", function (e) {
    table.columns().search('').draw();
  });
  
  // 客户下拉搜索
  $("#customer").select2({
    ajax: {
      url: rootUrl + "/api/master/customers",
    }
  });
  
  
  $('#receivedOrderDate').daterangepicker({
		format: 'YYYY-MM-DD',
	    showDropdowns: true,
	    showWeekNumbers: true,
	    timePicker: true,
	    timePickerIncrement: 1,
	    timePicker24Hour: true,
	    opens: 'right',
	    drops: 'down',
		locale: {
	        applyLabel: '确认',
	        cancelLabel: '取消',
	        fromLabel : '起始时间',
	        toLabel : '结束时间',
	        customRangeLabel : '自定义',
	        firstDay : 1
	    },
	    ranges: {
	      '今天': [moment(), moment()],
	      '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
	      '近7天': [moment().subtract(6, 'days'), moment()],
	      '近30天': [moment().subtract(29, 'days'), moment()],
	      '当月': [moment().startOf('month'), moment().endOf('month')],
	      '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
	    },
	    startDate: moment().subtract(1, 'days'),
	    endDate: moment()
	  }, function (start, end) {
	    $('#receivedOrderDate').val(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
	  });
  
  
  $('#requiredConsignmentDate').daterangepicker({
		format: 'YYYY-MM-DD HH:mm:ss',
	    showDropdowns: true,
	    showWeekNumbers: true,
	    timePicker: true,
	    timePickerIncrement: 1,
	    timePicker24Hour: true,
	    opens: 'right',
	    drops: 'down',
		locale: {
	        applyLabel: '确认',
	        cancelLabel: '取消',
	        fromLabel : '起始时间',
	        toLabel : '结束时间',
	        customRangeLabel : '自定义',
	        firstDay : 1
	    },
	    ranges: {
	      '今天': [moment(), moment()],
	      '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
	      '近7天': [moment().subtract(6, 'days'), moment()],
	      '近30天': [moment().subtract(29, 'days'), moment()],
	      '当月': [moment().startOf('month'), moment().endOf('month')],
	      '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
	    },
	    startDate: moment().subtract(1, 'days'),
	    endDate: moment()
	  }, function (start, end) {
	    $('#requiredConsignmentDate').val(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
	  });
  

//  var customerOrderNos = [];
//  $('#table tbody').on( 'click', 'input', function (e) {
//	  customerOrderNos = [];
//	  var obj = e.target;
//	  if(e.target.classList.length==0){
//		  e.target.classList.add('sel')
//		  var a = $(this).parent().parent().parent().find('.customerOrderNo')[0].innerText;
//		  $(e.target).attr( "data-customerOrderNo" ,a );
//	  }else{
//		  e.target.classList.remove('sel');
//		  $(e.target).removeAttr( "data-customerOrderNo");
//	  }
//  	
//	  $('input:checked').each(function(){
//		  customerOrderNos.push($(this).attr('data-customerOrderNo'))
//	  })
//	  console.log(customerOrderNos)
//	} )
//	
	//导出 动态组织form提交
	var startDown = true;
  $(".btn.export").on("click", function (e) {
	  if(startDown){
			startDown = false;
				$('.loading').show();
				$('#uploadText').text('下载中...')
				setTimeout(function(){
					$('.loading').hide();
					$('#uploadText').text('导出数据')
					startDown = true;
				}, 5000);
	console.log(table);
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
	  }
  });
  
//  
//	// 导出 动态组织form提交
//	var startDown = true;
//  $(".btn.export").on("click", function (e) {
//	  $("#exportForm .param").remove();
//		var $frm = $("#exportForm");
//		  if(customerOrderNos.length==0){
//			  alert('请勾选数据');
//			  return
//		  }
//	  if(startDown){
//			startDown = false;
//				$('.loading').show();
//				$('#uploadText').text('导出客戶订单下载中...')
//				setTimeout(function(){
//					$('.loading').hide();
//					$('#uploadText').text('导出客戶订单执行情况')
//					startDown = true;
//				}, 5000);
//				
//				$frm.append($('<input class="param" type="hidden" name="customerOrderNos" id="customerOrderNos" value = \'' + customerOrderNos[0] + '\' />')); 
//				$frm.submit();
//				// 阻止默认行为
//				e.preventDefault();
//				return false; 
//	  }
	
 // });
  
});
