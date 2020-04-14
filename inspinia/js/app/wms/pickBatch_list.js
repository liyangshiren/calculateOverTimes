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
		$('#planPackageDate').val(timeNormal) // 给搜索时间赋值
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
    {data: 'pickBatchCode',name:'pickBatchCode','class': 'text-center',defaultContent: ''}, 
    {data: 'productionPlan.productionPlanNo',name:'productionPlanNo','class': 'text-center',defaultContent: ''}, 
    {data: 'customerCode',name:'customerCode','class': 'text-center',defaultContent: ''}, 
    {data: 'customerOrderNo',name:'customerOrderNo','class': 'text-center',defaultContent: ''}, 
    {data: 'requiredConsignmentDate',name:'requiredConsignmentDate', 'class': 'text-center',defaultContent: ''},
    /*{data: 'requiredConsignmentDate',name:'requiredConsignmentDate', 'class': 'text-center',defaultContent: '',
    	render: function (data, type, full) {// 全部列值可以通过full.列名获取,一般单个列值用data
												// PS:这里的render是有多少列就执行多少次方法
    	     if (data == null || data.trim() == "") {
    	    	return "";	
    	     } else {
    	    	 var arrDate = data.split(" ");
    	    	 var sdate = arrDate[0].split('-');
    	    	 var date = new Date(sdate[0], sdate[1]-1, sdate[2]); 
    	    	return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
    	     }
    	}
	},*/
	{data: 'planPackageDate',name:'planPackageDate', 'class': 'text-center',defaultContent: ''},
    /*{data: 'planPackageDate',name:'planPackageDate', 'class': 'text-center',defaultContent: '',
		render: function (data, type, full) {
			if (data == null || data.trim() == "") {
				return "";
			} else {
				var arrDate = data.split(" ");
				var sdate = arrDate[0].split('-');
				var date = new Date(sdate[0], sdate[1], sdate[2]); 
				return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
			}
		}
    },*/
    {data: 'sailingNo',name:'sailingNo', 'class': 'text-center',defaultContent: ''},
    {data: 'loc.id', name: 'loc', defaultContent: '', visible : false}, 
    {data: 'loc.no','class': 'text-center', defaultContent: ''},
//    {data: 'status',name:'status', 'class': 'text-center',defaultContent: ''},
    {data: 'status', name:'status',
    	render: function (data, type, row, meta) {
    		return VALUES_MAP_PICK_BATCH_STATUS && VALUES_MAP_PICK_BATCH_STATUS[data] ? VALUES_MAP_PICK_BATCH_STATUS[data].text : '';
    		return VALUES_MAP_DICT_STATUS && VALUES_MAP_DICT_STATUS[data] ? VALUES_MAP_DICT_STATUS[data].text : '';
        }
	},
    {data: 'createdBy',name:'createdBy', 'class': 'text-center',defaultContent: ''},
    {data: 'createdDate',name:'createdDate', 'class': 'text-center',defaultContent: ''},
    {
        data: "id",
        defaultContent: '',
        sortable: false,
        'class': 'text-center',
        render: function (data, type, row, meta) {
            return '<a class="btn btn-default btn-xs" href="'+rootUrl+'/wms/pickTicket/'+ row.id + '/' + $('#planPackageDate').val() + '"><i class="fa fa-list"></i></a>';
          }
      },
    {
      data: "",
      defaultContent: '',
      sortable: false,
      'class': 'text-center',
      render: function (data, type, row, meta) {
        return ('<div class="btn-group">' +
// '<a class="btn btn-default btn-xs" title="查看明细" href="' + baseUrl + '/edit/'
// + row.id + '"><i class="fa fa-edit"></i></a>' +
            '<a class="btn btn-danger" id="close" title="关闭" href="#">关闭</a>' +
            '</div>' +
            '&nbsp;&nbsp;');
      }
    }]
  });
  
   
  
  $('#search').on("click", function (e) {
	  var searchTime = $('#planPackageDate').val(); // 判断时间间隔
	  	if(searchTime) {
	  		console.log(searchTime)
	  		var searchStart = searchTime.split(' - ')[0];
		  	var searchEnd = searchTime.split(' - ')[1];
		  	var searchTimeCha = (new Date(searchEnd).getTime() - new Date(searchStart).getTime())/1000/60/60/24;
		  	console.log(searchTimeCha)
		  	if(searchTimeCha > 30) {
		  		bootbox.alert('拣配单单次查询日期范围最大值为30天！')
		  		return false;
		  	}
	  	}
	  	//input值 在这边set了 上面的ajax data 就不用传给后端了，注意find('【input】（这个地方copy时容易疏忽，有的是【select】）#pickBatchCode')
	  	var pickBatchCode = $.trim($('.search-form').find('input#pickBatchCode').val());
	    var customerOrderNo = $('.search-form').find('input#customerOrderNo').val();
	    var productionPlanNo = $('.search-form').find('input#productionPlanNo').val();
	    var status = $('.search-form').find('select#status').val();
	    var sailingNo = $('.search-form').find('input#sailingNo').val();
	    var customer = $('.search-form').find('select#customer').val();
	    table.column('pickBatchCode:name').search(pickBatchCode);
	    table.column('sailingNo:name').search(sailingNo);
	    table.column('customerOrderNo:name').search(customerOrderNo);
	    table.column('productionPlanNo:name').search(productionPlanNo);
	    table.column('status:name').search(status);
	    table.column('customer:name').search(customer);
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
	
  	table.on('click', '#close', function () {
	    var dateSource = table.row($(this).parents('tr')).data();
	    var id = dateSource.id;
	    var pickBatchCode = dateSource.pickBatchCode;
	    $("#closeForm #ids").val(id);
	      if (id) {
	        bootbox.confirm("确定要关闭【"+pickBatchCode+"】拣配单吗?", function (result) {
	          if (result) {
	            $("#closeForm").submit();
	          }
	       });
	     }
  	});

  //导出 动态组织form提交
    $(".btn.export").on("click", function (e) {
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
});
