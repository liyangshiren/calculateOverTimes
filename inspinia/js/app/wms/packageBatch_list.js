$(document).ready(function () {

// $("#customerOrderNo").inputarea();
	
	var planPackageDateHidden = $("#planPackageDateHidden").val();
	if(planPackageDateHidden != null && planPackageDateHidden != ''){
		$('#planPackageDate').val(planPackageDateHidden);
	} else {
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
		var time = new Date().getTime() + 1000*60*60*24*30;
		var timeEndStart = new Date(time).toLocaleDateString().replace(/\//g,'-');
		if(timeEndStart.split('-')[1] < 10) {
			timeEndStart = timeEndStart.split('-')[0] + "-" + "0" + timeEndStart.split('-')[1] + "-" + timeEndStart.split('-')[2];
		}
		if(timeEndStart.split('-')[2] < 10) {
			timeEndStart = timeEndStart.split('-')[0] + "-" + timeEndStart.split('-')[1] + "-" + "0" + timeEndStart.split('-')[2];
		}
		var timeNormal = nowTime + " - " + timeEndStart;
		$('#planPackageDate').val(timeNormal)
	}
	
	
  var table = $('table#table').DataTable({
	  scrollX : true,
	  autoWidth : true,
    ajax : {
		url : baseUrl + '/datatable',
// type : "POST",
		data : function(d) {
			//传给后端
			var planPackageDate = $("#planPackageDate").val();
    		d.planPackageDate = planPackageDate;
    		d.customer = $("#customer").val();
    		d.locId = $("#locId").val();
    		d.status = $("#status").val();
    		d.part = $("#part").val();
    		d.productionPlanNo = $("#productionPlanNo").val();
    		d.sailingNo = $("#sailingNo").val();
    		var createdDate = $("#createdDate").val();
    		d.createdDate = createdDate;
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
        return '<div class="checkbox"><input type="checkbox" name="ids" value="' + data + '"/><label for="ids"/></div>'
      }
    }, 
    {data: 'packageBatchCode',name:'packageBatchCode','class': 'text-center',defaultContent: ''}, 
    {data: 'productionPlan.productionPlanNo',name:'productionPlanNo','class': 'text-center',defaultContent: ''},
    {data: 'customerCode',name:'customerCode','class': 'text-center',defaultContent: ''}, 
    {data: 'customerOrderNo',name:'customerOrderNo','class': 'text-center',defaultContent: ''}, 
    {data: 'requiredConsignmentDate',name:'requiredConsignmentDate', 'class': 'text-center',defaultContent: ''},
    {data: 'planPackageDate',name:'planPackageDate', 'class': 'text-center',defaultContent: ''},
    {data: 'sailingNo',name:'sailingNo', 'class': 'text-center',defaultContent: ''},
    {data: 'loc.id', name: 'loc', defaultContent: '', visible : false}, 
    {data: 'loc.no','class': 'text-center', defaultContent: ''},
//    {data: 'status',name:'status', 'class': 'text-center',defaultContent: ''},
    {
        data: 'status', name:'status',
        render: function (data, type, row, meta) {
          return VALUES_MAP_DICT_STATUS && VALUES_MAP_DICT_STATUS[data] ? VALUES_MAP_DICT_STATUS[data].text : '';
        }
    },
    {data: 'createdBy',name:'createdBy', 'class': 'text-center',defaultContent: ''},
    {data: 'createdDate',name:'createdDate', 'class': 'text-center',defaultContent: ''},
    {
        data: 'printStatus',
        render: function (data, type, row, meta) {
          return VALUES_MAP_DICT_PRINT_STATUS && VALUES_MAP_DICT_PRINT_STATUS[data] ? VALUES_MAP_DICT_PRINT_STATUS[data].text : '';
        }
    },
    {
        data: "id",
        defaultContent: '',
        sortable: false,
        'class': 'text-center',
        render: function (data, type, row, meta) {
            return '<a class="btn btn-default btn-xs" href="'+rootUrl+'/wms/packageDetail/'+ row.id + '/' + $('#planPackageDate').val() + '"><i class="fa fa-list"></i></a>';
        }
    },
    {
        data: "",
        defaultContent: '',
        sortable: false,
        'class': 'text-center',
        render: function (data, type, row, meta) {
      	  var div = "";
      	  div = div +'<div class="btn-group">' +
            '<a class="btn btn-danger" id="fresh" title="刷新" href="#">刷新</a>' +
            '</div>'
      	  console.log(row.status);
          return div;
        }
    },
    {
      data: "",
      defaultContent: '',
      sortable: false,
      'class': 'text-center',
      render: function (data, type, row, meta) {
    	  var div = "";
    	  div = div +'<div class="btn-group">' +

          '<a class="btn btn-danger" id="close" title="关闭" href="#">关闭</a>' +
          '</div>' +'&nbsp;&nbsp;'
          if(row.status != 3){
        	  div = div + '<a class="btn btn-danger " title="打印一级标签" href="' + baseUrl + '/print/'
              + row.id + '">打印一级标签</a>' +
  					'&nbsp;&nbsp;'
          }
    	  console.log(row.status);
        return div;
      }
    }]
  });
  
   
  
  $('#search').on("click", function (e) {
	  var searchTime = $('#planPackageDate').val();
	  	if(searchTime) {
	  		console.log(searchTime)
	  		var searchStart = searchTime.split(' - ')[0];
		  	var searchEnd = searchTime.split(' - ')[1];
		  	var searchTimeCha = (new Date(searchEnd).getTime() - new Date(searchStart).getTime())/1000/60/60/24;
		  	console.log(searchTimeCha)
		  	if(searchTimeCha > 30) {
		  		bootbox.alert('包装任务单次查询日期范围最大值为30天！')
		  		return false;
		  	}
	  	}
	  	//input值 在这边set了 上面的ajax data 就不用传给后端了，注意find('【input】（这个地方copy时容易疏忽，有的是【select】）#pickBatchCode')
	  	var packageBatchCode = $.trim($('.search-form').find('input#packageBatchCode').val());
	    var customerOrderNo = $('.search-form').find('input#customerOrderNo').val();
	    var productionPlanNo = $('.search-form').find('input#productionPlanNo').val();
	    var sailingNo = $('.search-form').find('input#sailingNo').val();
	    var status = $('.search-form').find('select[name="status"]').val();
	    var locNo = $('.search-form').find('select[name="locNo"]').val();
	    table.column('packageBatchCode:name').search(packageBatchCode);
	    table.column('customerOrderNo:name').search(customerOrderNo);
	    table.column('productionPlanNo:name').search(productionPlanNo);
	    table.column('sailingNo:name').search(sailingNo);
	    table.column('status:name').search(status);
	    table.column('locNo:name').search(locNo);
	    table.draw();
	    // 阻止表单submit
	    return false;
	  });
  
  $('#createdDate').daterangepicker({
		format : 'YYYY-MM-DD HH:mm:ss',
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
	}, function(start, end) {
		$('#createdDate').val(start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));
	});
	$('#createdDate').val(moment({hour: 0, minute: 0, second: 0}).subtract(6, 'days').format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment({hour: 23, minute: 59, second: 59}).format('YYYY-MM-DD HH:mm:ss'));
	
  
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
  
  
  //导出 动态组织form提交
  $(".btn.export").on("click", function (e) {
	  var ids = [];
	    $('#table>tbody input:checked').each(function (i, item) {
	      ids.push($(item).val());
	    });
	    $("#printForm #ids").val(ids.join(","));
	$("#exportForm .param").remove();
	var $frm = $("#exportForm");
　　　var array = $('.search-form').serializeArray();
　　　for (i = 0, length = array.length; i < length; i++) {
	　　　key = array[i].name;
		value = array[i].value;
		$frm.append($('<input class="param" type="hidden" name = "' + key + '" value = "' + value + '" />')); 
	}
	var params = table.ajax.params();
	$frm.append($('<input class="param" type="hidden" name="ids" value = \'' + ids + '\' />')); 
	$frm.append($('<input class="param" type="hidden" name="input" value = \'' + JSON.stringify(params) + '\' />')); 
	$frm.submit();
	// 阻止默认行为
	e.preventDefault();
	return false;  
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
  
  	table.on('click', '#close', function () {
	    var dateSource = table.row($(this).parents('tr')).data();
	    var id = dateSource.id;
	    var packageBatchCode = dateSource.packageBatchCode;
	    $("#closeForm #ids").val(id);
	      if (id) {
	        bootbox.confirm("确定要关闭【"+packageBatchCode+"】包装任务单吗?", function (result) {
	          if (result) {
	            $("#closeForm").submit();
	          }
	       });
	     }
  	});
  	
  	$("#part").select2({
		ajax : {
			url : rootUrl + "/api/master/parts",
			data : function(params) {
				params.q = params.term;
				return params;
			}
		}
	});
  	
  	table.on('click', '#fresh', function () {
	    var dateSource = table.row($(this).parents('tr')).data();
	    var id = dateSource.id;
	    var packageBatchCode = dateSource.packageBatchCode;
	    $("#freshForm #id").val(id);
	      if (id) {
	        bootbox.confirm("确定要刷新【"+packageBatchCode+"】包装任务单吗?", function (result) {
	          if (result) {
	            $("#freshForm").submit();
	          }
	       });
	     }
  	});
  
});
