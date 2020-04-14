$(document).ready(function () {

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
		url : baseUrl + '/report',
		data : function(d) {
			d.partNo = $.trim($("#partNo").val());
			var requiredConsignmentDate = $("#requiredConsignmentDate").val();
    		d.requiredConsignmentDate = requiredConsignmentDate;
    		var receivedOrderDate = $("#receivedOrderDate").val();
    		d.receivedOrderDate = receivedOrderDate;
    		d.customerOrderNo = $("#customerOrderNo").val();
    		d.customerId = $("#customerId").val();
    		d.plantId = $("#plant").val();
    		return d;
		}
	},
    order: [
      [2, 'asc'],[3, 'asc']
    ],
    columns: [
    {data: 'plant.id',name:'plant', 'class': 'text-center',defaultContent: '', visible : false},
    {data: 'plantNo',name:'plantNo', 'class': 'text-center',defaultContent: ''},
    {data: 'customerCountry',name:'customerCountry', 'class': 'text-center',defaultContent: ''},
    {data: 'customerOrderNo',name:'customerOrderNo', 'class': 'text-center',defaultContent: ''},
    {data: 'customerCode',name:'customerCode','class': 'text-center',defaultContent: ''}, 
    {data: 'customerName',name:'customerName','class': 'text-center',defaultContent: ''}, 
    {data: 'receivedOrderDate',name:'receivedOrderDate', 'class': 'text-center',defaultContent: ''},
    {data: 'requiredShipDate',name:'requiredShipDate', 'class': 'text-center',defaultContent: ''},
    {data: 'requiredConsignmentDate',name:'requiredConsignmentDate', 'class': 'text-center',defaultContent: ''},
    {data: 'partNo',name:'partNo', 'class': 'text-center',defaultContent: ''},
    {data: 'partName',name:'partName', 'class': 'text-center',defaultContent: ''},
    {data: 'requiredQty',name:'requiredQty', 'class': 'text-center',defaultContent: ''},
    {data: 'sdsNo',name:'sdsNo', 'class': 'text-center',defaultContent: ''},
    {data: 'requiredReceiveQty',name:'requiredReceiveQty', 'class': 'text-center',defaultContent: ''},
    {data: 'requiredTime',name:'requiredTime', 'class': 'text-center',defaultContent: ''},
    {data: 'partReceiveQty',name:'partReceiveQty', 'class': 'text-center',defaultContent: ''},
    {data: 'lastReceiveDate',name:'lastReceiveDate', 'class': 'text-center',defaultContent: ''}
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
		  		bootbox.alert('客户订单到货情况单次查询日期范围最大值为30天！')
		  		return false;
		  	}
	  	}
	  	var plant = $('.search-form').find('select#plant').val();
	  	var customerCode = $.trim($('.search-form').find('input#customerCode').val());
	    var customerOrderNo = $('.search-form').find('input#customerOrderNo').val();
	    table.column('plant:name').search(plant);
	    table.column('customerCode:name').search(customerCode);
	    table.column('customerOrderNo:name').search(customerOrderNo);
	    table.draw();
	    //阻止表单submit
	    return false;
	  });
  
  $('#clear').on("click", function (e) {
    table.columns().search('').draw();
  });
  
  //客户下拉搜索
  $("#customerId").select2({
    ajax: {
      url: rootUrl + "/api/master/customers",
    }
  });
  
  	//工厂下拉搜索
	$("#plant").select2({
		ajax : {
			url : rootUrl + "/api/master/plants",
		}
	});
  
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
  
  
  $('#requiredConsignmentDate').daterangepicker({
		format : 'YYYY-MM-DD',
		showDropdowns : true,
		showWeekNumbers : true,
		timePicker : true,
		timePickerIncrement : 1,
		timePicker24Hour : true,
		opens : 'right',
		drops : 'down',
		locale: {
            applyLabel: '确认',
            cancelLabel: '取消',
            fromLabel : '起始时间',
            toLabel : '结束时间',
            customRangeLabel : '自定义',
            firstDay : 1
        },
		ranges : {
			'今天' : [ moment(), moment() ],
			'昨天' : [ moment().subtract(1, 'days'), moment().subtract(1, 'days') ],
			'近7天' : [ moment().subtract(6, 'days'), moment() ],
			'近30天' : [ moment().subtract(29, 'days'), moment() ],
			'当月' : [ moment().startOf('month'), moment().endOf('month') ],
			'上月' : [ moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month') ]
		},
		startDate : moment().subtract(1, 'days'),
		endDate : moment()
	}, function (start, end) {
	    $('#requiredConsignmentDate').val(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
	});
  
  $('#receivedOrderDate').daterangepicker({
		format : 'YYYY-MM-DD',
		showDropdowns : true,
		showWeekNumbers : true,
		timePicker : true,
		timePickerIncrement : 1,
		timePicker24Hour : true,
		opens : 'right',
		drops : 'down',
		locale: {
          applyLabel: '确认',
          cancelLabel: '取消',
          fromLabel : '起始时间',
          toLabel : '结束时间',
          customRangeLabel : '自定义',
          firstDay : 1
      },
		ranges : {
			'今天' : [ moment(), moment() ],
			'昨天' : [ moment().subtract(1, 'days'), moment().subtract(1, 'days') ],
			'近7天' : [ moment().subtract(6, 'days'), moment() ],
			'近30天' : [ moment().subtract(29, 'days'), moment() ],
			'当月' : [ moment().startOf('month'), moment().endOf('month') ],
			'上月' : [ moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month') ]
		},
		startDate : moment().subtract(1, 'days'),
		endDate : moment()
	}, function (start, end) {
	    $('#receivedOrderDate').val(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
	});
  
});
