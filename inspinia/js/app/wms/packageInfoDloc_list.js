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
	var timeEnd = new Date().getTime() + 1000*60*60*24*30;
	var timeEndStart = new Date(time).toLocaleDateString().replace(/\//g,'-');
	var timeEndLevel = new Date(timeEnd).toLocaleDateString().replace(/\//g,'-');
	if(timeEndStart.split('-')[1] < 10) {
		timeEndStart = timeEndStart.split('-')[0] + "-" + "0" + timeEndStart.split('-')[1] + "-" + timeEndStart.split('-')[2];
	}
	if(timeEndLevel.split('-')[1] < 10) {
		timeEndLevel = timeEndLevel.split('-')[0] + "-" + "0" + timeEndLevel.split('-')[1] + "-" + timeEndLevel.split('-')[2];
	}
	if(timeEndStart.split('-')[2] < 10) {
		timeEndStart = timeEndStart.split('-')[0] + "-" + timeEndStart.split('-')[1] + "-" + "0" + timeEndStart.split('-')[2];
	}
	if(timeEndLevel.split('-')[2] < 10) {
		timeEndLevel = timeEndLevel.split('-')[0] + "-" + timeEndLevel.split('-')[1] + "-" + "0" + timeEndLevel.split('-')[2];
	}
	var timeNormal = timeEndStart + " - " + timeEndLevel;
	$('#planPackageDate').val(timeNormal) // 给搜索时间赋值
  var table = $('table#table').DataTable({
	  scrollX : true,
	  autoWidth : true,
    ajax : {
		url : baseUrl + '/info',
// type : "POST",
		data : function(d) {
			//传给后端
			var completeDate = $("#completeDate").val();
    		d.completeDate = completeDate;
    		d.leveloneBarcode = $("#leveloneBarcode").val();
    		d.leveltwoBarcode = $("#leveltwoBarcode").val();
    		d.barcode = $("#barcode").val();
    		d.status = $("#status").val();
    		d.customerOrderNo = $("#customerOrderNo").val();
    		d.customerCode = $("#customerCode").val();
    		var shipmentDate = $("#shipmentDate").val();
    		d.shipmentDate = shipmentDate;
    		var planPackageDate = $("#planPackageDate").val();
    		d.planPackageDate = planPackageDate;
    		d.dLoc = $("#dLoc").val();
    		d.partNo = $("#partNo").val();
    		return d;
		}
	},
    columns: [{
      data: 'id',
      sortable: false,
      defaultContent: '',
      'class': 'text-center checkBoxIput',
      render: function (data, type, row, meta) {
//        return '<div class="checkbox"><input type="checkbox" name="ids" value=""/><label for="ids"/></div>'
    	  return '<div class="checkbox"><input type="checkbox" data-dLocNo="'+row.dLocNo+'" name="ids" value="' + data + '"/><label for="ids"/></div>'
      }
    }, 
    {data: 'leveloneBarcode',sortable: false,name:'leveloneBarcode','class': 'text-center',defaultContent: ''}, 
    {data: 'leveltwoBarcode',sortable: false,name:'leveltwoBarcode','class': 'text-center',defaultContent: ''}, 
    {data: 'barcode',sortable: false,name:'barcode','class': 'text-center barcode',defaultContent: ''}, 
    {
		data: 'status',sortable: false,
        render: function (data, type, row, meta) {
          return VALUES_MAP_DICT_STATUS && VALUES_MAP_DICT_STATUS[data] ? VALUES_MAP_DICT_STATUS[data].text : '';
        }
	},
    {data: 'customerCountry',sortable: false,name:'customerCountry','class': 'text-center',defaultContent: ''}, 
    {data: 'customerOrderNo',sortable: false,name:'customerOrderNo','class': 'text-center',defaultContent: ''}, 
    {data: 'customerCode',sortable: false,name:'customerCode','class': 'text-center',defaultContent: ''}, 
    {data: 'partNo',sortable: false,name:'partNo','class': 'text-center',defaultContent: ''}, 
    {data: 'partName',sortable: false,name:'partName','class': 'text-center',defaultContent: ''}, 
    {data: 'supplNo',sortable: false,name:'supplNo','class': 'text-center',defaultContent: ''}, 
    {data: 'qty',sortable: false,name:'qty','class': 'text-center',defaultContent: ''}, 
    {data: 'completeDate',sortable: false,name:'completeDate', 'class': 'text-center',defaultContent: '',
    	render: function (data, type, full) {// 全部列值可以通过full.列名获取,一般单个列值用data
												// PS:这里的render是有多少列就执行多少次方法
    	     if (data == null || data.trim() == "") {
    	    	return "";
    	     } else {
    	    	 var arrDate = data.split(" ");
    	    	 return arrDate[0];
    	     }
    	}
	},
    {data: 'locNo',sortable: false,name:'locNo','class': 'text-center',defaultContent: ''},
    {data: 'twoLocNo',sortable: false,name:'twoLocNo','class': 'text-center',defaultContent: ''},
    {data: 'dLocNo',sortable: false,name:'dLocNo','class': 'text-center dLocNo',defaultContent: ''},
    {data: 'container.sealNo',sortable: false,name:'container.sealNo','class': 'text-center',defaultContent: ''},
    {data: 'container.ladBillNo',sortable: false,name:'container.ladBillNo','class': 'text-center',defaultContent: ''},
    {data: 'container.sealer',sortable: false,name:'container.sealer','class': 'text-center',defaultContent: ''},	
    {data: 'sealDate',sortable: false,name:'sealDate', 'class': 'text-center',defaultContent: '',
    	render: function (data, type, full) {// 全部列值可以通过full.列名获取,一般单个列值用data
												// PS:这里的render是有多少列就执行多少次方法
    	     if (data == null || data.trim() == "") {
    	    	return "";
    	     } else {
    	    	 var arrDate = data.split(" ");
    	    	 return arrDate[0];
    	     }
    	}
	},
    {data: 'container.driver',sortable: false,name:'container.driver','class': 'text-center',defaultContent: ''},
    {data: 'container.vehicleNumber',sortable: false,name:'container.vehicleNumber','class': 'text-center',defaultContent: ''},	
    {data: 'container.contact',sortable: false,name:'container.contact','class': 'text-center',defaultContent: ''},
    {data: 'container.shipper',sortable: false,name:'container.shipper','class': 'text-center',defaultContent: ''},	
    
    {data: 'shipmentDate',sortable: false,name:'shipmentDate', 'class': 'text-center',defaultContent: '',
    	render: function (data, type, full) {// 全部列值可以通过full.列名获取,一般单个列值用data
												// PS:这里的render是有多少列就执行多少次方法
    	     if (data == null || data.trim() == "") {
    	    	return "";
    	     } else {
    	    	 var arrDate = data.split(" ");
    	    	 return arrDate[0];
    	     }
    	}
	},
	{data: 'planPackageDate',sortable: false,name:'planPackageDate', 'class': 'text-center',defaultContent: '',
    	render: function (data, type, full) {// 全部列值可以通过full.列名获取,一般单个列值用data
												// PS:这里的render是有多少列就执行多少次方法
    	     if (data == null || data.trim() == "") {
    	    	return "";
    	     } else {
    	    	 var arrDate = data.split(" ");
    	    	 return arrDate[0];
    	     }
    	}
	}
    ]
  });

  
  
  $('#search').on("click", function (e) {
	  var searchTime = $('#planPackageDate').val(); // 判断时间间隔
	  	if(searchTime) {
	  		console.log(searchTime)
	  		var searchStart = searchTime.split(' - ')[0];
		  	var searchEnd = searchTime.split(' - ')[1];
		  	var searchTimeCha = (new Date(searchEnd).getTime() - new Date(searchStart).getTime())/1000/60/60/24;
		  	console.log(searchTimeCha)
		  	if(searchTimeCha > 60) {
		  		bootbox.alert('计划包装信息查询单次查询日期范围最大值为60天！')
		  		return false;
		  	}
	  	}
	  	//input值 在这边set了 上面的ajax data 就不用传给后端了，注意find('【input】（这个地方copy时容易疏忽，有的是【select】）#pickBatchCode')
	  	var packageBatchCode = $.trim($('.search-form').find('input#packageBatchCode').val());
	    var customerOrderNo = $('.search-form').find('input#customerOrderNo').val();
	    var status = $('.search-form').find('select[name="status"]').val();
	    var locNo = $('.search-form').find('select[name="locNo"]').val();
	    table.column('packageBatchCode:name').search(packageBatchCode);
	    table.column('customerOrderNo:name').search(customerOrderNo);
	    table.column('status:name').search(status);
	    table.column('locNo:name').search(locNo);
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
  
  //包装库位下拉搜索
  $("#locId").select2({
    ajax: {
      url: rootUrl + "/api/master/locs",
    }
  });
  
  //成品区库区下拉搜索
  $("#dLoc").select2({
    ajax: {
      url: rootUrl + "/api/master/dLocChengPin",
    }
  });
  
  $('#completeDate').daterangepicker({
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
	    $('#completeDate').val(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
	  });
  
  $('#shipmentDate').daterangepicker({
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
	    $('#shipmentDate').val(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
	  });
  $('#planPackageDate').daterangepicker({
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
	    $('#planPackageDate').val(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
	  });
  
//	//导出动态组织form提交
//	$(".btn.export").on("click", function (e) {
//		$("#exportForm .param").remove();
//		var $frm = $("#exportForm");
//		var array = $('.search-form').serializeArray();
//		var rebateMap = {};
//		for (i = 0, length = array.length; i < length; i++) {
//　     		key = array[i].name;
//			value = array[i].value;
//			$frm.append($('<input class="param" type="hidden" name = "' + key + '" value = "' + value + '" />')); 
//			rebateMap[key] = value;
//		}
//		
//		var newData = JSON.stringify(rebateMap);
//	　	$.ajax({
//	　		url:baseUrl + '/qTotal',
//	　		type : 'get',
//	　		dataType:"json",
//	   		data: {
//	   			"paramStr" : newData
//	    	},
//			success : function(data) {
//				if(data == 1){
//					bootbox.alert("fail:导出数据时，请输入查询条件导出！");
//				} else if(data == 2){
//					bootbox.alert("fail:查询数据超出限值，请精确查询再做导出!");
//				} else if(data == 3){
//					bootbox.alert("fail:导出时出现异常，请重新查询再导出!");
//				} else {
//					var wh = $('.search-form').find('select[name="warehouse"]').val();
//					var dloc = $('.search-form').find('select[name="dloc"]').val();
//					var loc = $('.search-form').find('select[name="loc"]').val();
//					var suppl = $('.search-form').find('select[name="suppl"]').val();
//					var partNo = $('.search-form').find('input[name="partNo"]').val();
//					var partName = $('.search-form').find('input[name="partName"]').val();
//					var times = $("#actionTimeRange").val();
//					var barcode = $('.search-form').find('input[name="barcode"]').val();
//					var batch = $('.search-form').find('input[name="batch"]').val();
//					var outsidePullNo = $('.search-form').find('input[name="outsidePullNo"]').val();
//					var insidePullNo = $('.search-form').find('input[name="insidePullNo"]').val();
//					var actionType = $('.search-form').find('input[name="actionType"]').val();
//					var actionOperator = $('.search-form').find('input[name="actionOperator"]').val();
//					var frameoutSheetNo = $('.search-form').find('input[name="frameoutSheetNo"]').val();
//					var sendSheetNo = $('.search-form').find('input[name="sendSheetNo"]').val();
//					$frm.append($('<input class="param" type="hidden" name = "warehouse" value = "' + wh + '" />')); 
//					$frm.append($('<input class="param" type="hidden" name = "dloc" value = "' + dloc + '" />')); 
//					$frm.append($('<input class="param" type="hidden" name = "loc" value = "' + loc + '" />'));
//					$frm.append($('<input class="param" type="hidden" name = "suppl" value = "' + suppl + '" />'));
//					$frm.append($('<input class="param" type="hidden" name = "partNo" value = "' + partNo + '" />'));
//					$frm.append($('<input class="param" type="hidden" name = "partName" value = "' + partName + '" />'));
//					$frm.append($('<input class="param" type="hidden" name = "times" value = "' + times + '" />'));
//					$frm.append($('<input class="param" type="hidden" name = "barcode" value = "' + barcode + '" />'));
//					$frm.append($('<input class="param" type="hidden" name = "batch" value = "' + batch + '" />'));
//					$frm.append($('<input class="param" type="hidden" name = "outsidePullNo" value = "' + outsidePullNo + '" />'));
//					$frm.append($('<input class="param" type="hidden" name = "insidePullNo" value = "' + insidePullNo + '" />'));
//					$frm.append($('<input class="param" type="hidden" name = "actionType" value = "' + actionType + '" />'));
//					$frm.append($('<input class="param" type="hidden" name = "actionOperator" value = "' + actionOperator + '" />'));
//					$frm.append($('<input class="param" type="hidden" name = "frameoutSheetNo" value = "' + frameoutSheetNo + '" />'));
//					$frm.append($('<input class="param" type="hidden" name = "sendSheetNo" value = "' + sendSheetNo + '" />'));
//					$frm.submit();
//				}
//			},
//	    	error : function(data) {
//	    		bootbox.alert("fail:导出时出现异常，请重新查询再导出!");
//			}
//		});
//		// 阻止默认行为
//		e.preventDefault();
//		return false;
//	});
//  
//  $('#table .checkboxWrap').bind('click',function(){
//	  console.log(222)
//	  console.log( table.row( this ).data() );
//  })
  var barcodes = [];
  var dLocNos = [];
  $('#table tbody').on( 'click', 'input', function (e) {
	  barcodes = [];
	  dLocNos = [];
	  var obj = e.target;
	  if(e.target.classList.length==0){
		  e.target.classList.add('sel')
		  var a = $(this).parent().parent().parent().find('.barcode')[0].innerText;
		  var b = $(this).parent().parent().parent().find('.dLocNo')[0].innerText;
		  $(e.target).attr( "data-barcode" ,a );
		  $(e.target).attr( "data-dLocNo" ,b )
	  }else{
		  e.target.classList.remove('sel');
		  $(e.target).removeAttr( "data-barcode");
		  $(e.target).removeAttr( "data-dLocNo");
	  }
  	
	  $('input:checked').each(function(){
		  barcodes.push($(this).attr('data-barcode'))
		  dLocNos.push($(this).attr('data-dLocNo'))
	  })
	  console.log("xxxxxbarcodes_" + barcodes)
	  console.log("xxxxxdLocNos_" + dLocNos)
	} )
	
	$('.selectAll').bind( 'click', function (e) {
	  dLocNos = [];
	  if(e.target.title == '全选'){
		  $('.checkBoxIput input').each(function(){
			  dLocNos.push($(this).attr('data-dLocNo'));
		  })
	  }
	  console.log(dLocNos);
	} )
	
  
	//导出 动态组织form提交
  $(".btn.export").on("click", function (e) {
	$("#exportForm .param").remove();
	var $frm = $("#exportForm");
	if(barcodes.length>1){
		  alert('只能勾选一条数据');
		  return
	  }
	  if(barcodes.length==0){
		  alert('请勾选数据');
		  return
	  }
	  if(barcodes.length == 1 && barcodes[0] == ''){
		  alert('集装箱为空');
		  return
	  }
	  
	$frm.append($('<input class="param" type="hidden" name="barcode" id="barcode" value = \'' + barcodes[0] + '\' />')); 
	$frm.submit();
	// 阻止默认行为
	e.preventDefault();
	return false;
  });
  
  
  
	//导出 动态组织form提交
  $(".btn.exportFinished").on('click', function (e) {
	  console.log(dLocNos);
	$("#exportFinished .param").remove();
	var $frm = $("#exportFinished");
//	  if(dLocNos.length==0){
//		  alert('请勾选数据');
//		  return
//	  }
	  var flag = false;
	  dLocNos.map((value,key)=>{
		  if(value == ''){
			  alert('库区为空');
			  dLocNos.splice(key,1);
			  flag = true
		  }
	  })
	  if(flag){
		  return
	  }
	  
	$frm.append($('<input class="param" type="hidden" name="dLocNos" id="dLocNos" value = \'' + dLocNos.join(',') + '\' />')); 
	$frm.submit();
	// 阻止默认行为
	e.preventDefault();
	return false; 
  });
  
  
});
