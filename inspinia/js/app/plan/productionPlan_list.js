$(document).ready(function () {
	
//	var customerOrderNoHidden = $("#customerOrderNoHidden").val();
//	if(customerOrderNoHidden != null && customerOrderNoHidden != ''){
//		$('#customerOrderNo').val(customerOrderNoHidden);
//	}
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
	
//  $("#customerOrderNo").inputarea();
	
	
  var table = $('table#table').DataTable({
	scrollX : true,
	autoWidth : true,
    ajax : {
		url : baseUrl + '/datatable',
//		type : "POST",
		data : function(d) {
			var planPackageDate = $("#planPackageDate").val();
    		d.planPackageDate = planPackageDate;
    		var receivedOrderDate = $("#receivedOrderDate").val();
    		d.receivedOrderDate = receivedOrderDate;
    		d.customerOrderNo = $.trim($("#customerOrderNo").val());
    		d.customerId = $("#customerId").val();
    		d.status = $('.search-form').find('select[name="status"]').val();
    		d.plant = $('#plant').val();// 加上工厂Id 传递参数
    		d.part = $("#part").val();
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
    {data: 'plant.id',name:'plant','class': 'text-center',defaultContent: '', visible : false},
    {data: 'plant.no',name:'plant','class': 'text-center',defaultContent: ''},
    {data: 'productionPlanNo',name:'productionPlanNo','class': 'text-center',defaultContent: ''},
    {data: 'customerCountry',name:'customerCountry','class': 'text-center',defaultContent: ''},
    {data: 'customerOrderNo',name:'customerOrderNo', 'class': 'text-center',defaultContent: ''},
    {data: 'customerId',name:'customerId','class': 'text-center',defaultContent: '', visible : false},
    {data: 'customerCode',name:'customerCode','class': 'text-center',defaultContent: ''}, 
    {data: 'customerName',name:'customerName','class': 'text-center',defaultContent: ''}, 
    {data: 'requiredConsignmentDate',name:'requiredConsignmentDate', 'class': 'text-center',defaultContent: ''},
    {data: 'receivedOrderDate',name:'receivedOrderDate', 'class': 'text-center',defaultContent: ''},
    {data: 'planPackageDate',name:'planPackageDate', 'class': 'text-center',defaultContent: ''},
    {data: 'requiredShipDate',name:'requiredShipDate', 'class': 'text-center',defaultContent: ''},
    {data: 'planStartDate',name:'planStartDate', 'class': 'text-center',defaultContent: ''},
    {data: 'planEndDate',name:'planEndDate', 'class': 'text-center',defaultContent: ''},
    /*{data: 'lotCode',name:'lotCode', 'class': 'text-center',defaultContent: ''},*/
    {
        data: 'lotCode',
        render: function (data, type, row, meta) {
          return VALUES_MAP_DICBUS_LOTCODE && VALUES_MAP_DICBUS_LOTCODE[data] ? VALUES_MAP_DICBUS_LOTCODE[data].text : '';
        }
    },
    /*{data: 'eo',name:'eo', 'class': 'text-center',defaultContent: ''},*/
    {
        data: 'eo',
        render: function (data, type, row, meta) {
          return VALUES_MAP_DICT_EMERGENT_TYPE && VALUES_MAP_DICT_EMERGENT_TYPE[data] ? VALUES_MAP_DICT_EMERGENT_TYPE[data].text : '';
        }
    },
    {data: 'wkorder',name:'wkorder', 'class': 'text-center',defaultContent: ''},
    /*{data: 'shipmentType',name:'shipmentType', 'class': 'text-center',defaultContent: ''},*/
    {
        data: 'shipmentType',
        render: function (data, type, row, meta) {
          return VALUES_MAP_DICBUS_SHIPMENTTYPE && VALUES_MAP_DICBUS_SHIPMENTTYPE[data] ? VALUES_MAP_DICBUS_SHIPMENTTYPE[data].text : '';
        }
    },
    {data: 'sailingNo',name:'sailingNo', 'class': 'text-center',defaultContent: ''},
    {
    	name: 'status',
        data: 'status',
        render: function (data, type, row, meta) {
          return VALUES_MAP_DICT_STATUS && VALUES_MAP_DICT_STATUS[data] ? VALUES_MAP_DICT_STATUS[data].text : '';
        }
    },
    {data: 'createdBy',name:'createdBy', 'class': 'text-center',defaultContent: ''},
    {data: 'createdDate',name:'createdDate', 'class': 'text-center',defaultContent: ''},
    {data: 'lastModifiedBy',name:'lastModifiedBy', 'class': 'text-center',defaultContent: ''},
    {data: 'lastModifiedDate',name:'lastModifiedDate', 'class': 'text-center',defaultContent: ''},
    {
        data: "id",
        defaultContent: '',
        sortable: false,
        'class': 'text-center',
        render: function (data, type, row, meta) {
            return '<a class="btn btn-default btn-xs" href="'+rootUrl+'/plan/productionDetail/'+ row.id + '/'+ ($("#planPackageDate").val()) 
             +'"><i class="fa fa-list"></i></a>';
        }
    },
    {
      data: "",
      defaultContent: '',
      sortable: false,
      'class': 'text-center',
      render: function (data, type, row, meta) {
        return ('<div class="btn-group">' +
            '<a class="btn btn-default btn-xs" title="修改" href="' + baseUrl + '/edit/' + row.id + '"><i class="fa fa-edit"></i></a>' +
            '<a class="btn btn-default btn-xs check" title="校验" href="#"><i class="fa fa-check"></i></a>' +
            '<a class="btn btn-default btn-xs publish" title="发布" href="#"><i class="fa fa-hand-o-up"></i></a>' +
            '<a class="btn btn-default btn-xs close" title="关闭" href="#"><i class="fa fa-close"></i></a>' +
            '<a class="btn btn-default btn-xs del" title="删除" href="#"><i class="fa fa-trash-o"></i></a>' +
            '</div>' +
            '&nbsp;&nbsp;');
      }
    }]
  });
  table.on('click', '.close', function () {
    var id = table.row($(this).parents('tr')).data().id;
    $("#closeForm #ids").val(id);
    var planPackageDate = $("#planPackageDate").val();
    $("#closeForm #planPackageDateClose").val(planPackageDate);
      if (id) {
        bootbox.confirm("关闭生产计划时对应的包装任务和拣配任务将同步关闭,确认关闭吗?", function (result) {
          if (result) {
        	  $("#closeForm").submit();
          }
       });
     }
  });
  
  
  table.on('click', '.publish', function () {
	    var id = table.row($(this).parents('tr')).data().id;
	    $("#publishForm #ids").val(id);
	    var planPackageDate = $("#planPackageDate").val();
	    $("#publishForm #planPackageDatePublish").val(planPackageDate);
	    $("#publishForm").submit();
//	    $.get(baseUrl + '/publish/check/' + id,{},function(res){
//	    	if(res !='SUCCESS'){
//    		   bootbox.confirm(res, function (result) {
//    		          if (result) {
//    		        	  $("#publishForm").submit();
//    		          }else{
//		        		    $("#exportError #ids").val(id);
//		        		    $("#exportError").submit();
//    		          }
//    		       });
//	    	}else{
//	    		$("#publishForm").submit();
//	    	}
//	    });
	  });

					  
	table.on('click', '.check', function() {
		var id = table.row($(this).parents('tr')).data().id;
		$.get(baseUrl + '/publish/check/' + id, {}, function(res) {
			if (res!= '检查通过') {
				bootbox.confirm(res, function(result) {
					if (result) {
						$("#exportError #ids").val(id);
						$("#exportError").submit();
					}
				});
			}else{
				bootbox.confirm(res, function(result) {});
			}
		});
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
  
	table.on('click', '.del', function () {
	    var id = table.row($(this).parents('tr')).data().id;
	    console.warn(id); 
	    $("#delForm #ids").val(id);
	    if (id) {
	      bootbox.confirm("确定要删除整单数据吗?", function (result) {
	        if (result) {
	        	console.warn(result+id); 
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
   
  /*$('.search-form').on("submit", function (e) {
    var customerCode = $('.search-form').find('select#customerCode').val();
    var customerOrderNo = $('.search-form').find('input#customerOrderNo').val();
    table.column('customerCode:name').search(customerCode);
    table.column('customerOrderNo:name').search(customerOrderNo);
    table.draw();
    return false;
  });*/
  $('#search').on("click", function (e) { // '#search' 搜素的Id
	  var planPackageDate = $('#planPackageDate').val(); // 判断时间间隔
	  	if(planPackageDate) {
	  		console.log(planPackageDate)
	  		var searchStart = planPackageDate.split(' - ')[0];
		  	var searchEnd = planPackageDate.split(' - ')[1];
		  	var planPackageDateCha = (new Date(searchEnd).getTime() - new Date(searchStart).getTime())/1000/60/60/24;
		  	console.log(planPackageDateCha)
		  	if(planPackageDateCha > 60) {
		  		bootbox.alert('生产计划单次查询日期范围最大值为60天！')
		  		return false;
		  	}
	  	}
	  	var plant = $('.search-form').find('select[name="plant"]').val();
	    var customerId = $('.search-form').find('select[name="customerId"]').val();
	    var customerOrderNo = $('.search-form').find('input#customerOrderNo').val();
	    var productionPlanNo = $('.search-form').find('input#productionPlanNo').val();
	    var partNo = $('.search-form').find('input#partNo').val();
	    var status = $('.search-form').find('select[name="status"]').val();
	    table.column('plant:name').search(plant);
	    table.column('customerId:name').search(customerId);
	    table.column('customerOrderNo:name').search(customerOrderNo);
	    table.column('productionPlanNo:name').search(productionPlanNo);
	    table.column('partNo:name').search(partNo);
	    table.column('status:name').search(status);
	    table.draw();
	    //.search 用于模糊搜素的,如果不需要就不用拼接上
	    //阻止表单submit
	    return false;
	  });
  /*$('#search').on("click", function (e) {
	  	var customerCode = $.trim($('.search-form').find('input#customerCode').val());
	    var customerOrderNo = $('.search-form').find('select#customerOrderNo').val();
	    table.column('customerCode:name').search(customerCode);
	    table.column('customerOrderNo:name').search(customerOrderNo);
	    table.draw();
	    //阻止表单submit
	    return false;
	  });*/
  
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
    ajax: {
      url: rootUrl + "/api/master/plants",
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
