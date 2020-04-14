$(document).ready(function () {

//  $("#customerOrderNo").inputarea();
	var requiredConsignmentDateHidden = $("#requiredConsignmentDateHidden").val();
	if(requiredConsignmentDateHidden != null && requiredConsignmentDateHidden != ''){
		$('#requiredConsignmentDate').val(requiredConsignmentDateHidden);
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
		var time = new Date().getTime() + 1000*60*60*24*60;
		var timeEndStart = new Date(time).toLocaleDateString().replace(/\//g,'-');
		if(timeEndStart.split('-')[1] < 10) {
			timeEndStart = timeEndStart.split('-')[0] + "-" + "0" + timeEndStart.split('-')[1] + "-" + timeEndStart.split('-')[2];
		}
		if(timeEndStart.split('-')[2] < 10) {
			timeEndStart = timeEndStart.split('-')[0] + "-" + timeEndStart.split('-')[1] + "-" + "0" + timeEndStart.split('-')[2];
		}
		var timeNormal = nowTime + " - " + timeEndStart;
		$('#requiredConsignmentDate').val(timeNormal)
	}
	
  var table = $('table#table').DataTable({
	scrollX : true,
	autoWidth : true,
    ajax : {
		url : baseUrl + '/datatable',
//		type : "POST",
		data : function(d) {
//			d.partNo = $.trim($("#partNo").val());
			var requiredConsignmentDate = $("#requiredConsignmentDate").val();
    		d.requiredConsignmentDate = requiredConsignmentDate;
    		d.customerOrderNo = $("#customerOrderNo").val();
    		d.customerId = $("#customerId").val();
    		d.part = $("#part").val();
    		var createdDate = $("#createdDate").val();
    		d.createdDate = createdDate;
//    		d.status = $('.search-form').find('select[name="status"]').val();
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
    {data: 'plant.id',name:'plant', 'class': 'text-center',defaultContent: '', visible : false},
    {data: 'plant.no',name:'plant', 'class': 'text-center',defaultContent: ''},
    {data: 'customerCountry',name:'customerCountry', 'class': 'text-center',defaultContent: ''},
    {data: 'customerOrderNo',name:'customerOrderNo', 'class': 'text-center',defaultContent: ''},
    {data: 'customerId',name:'customerId','class': 'text-center',defaultContent: '', visible : false}, 
    {data: 'customerCode',name:'customerCode','class': 'text-center',defaultContent: ''}, 
    {data: 'customerName',name:'customerName','class': 'text-center',defaultContent: ''}, 
    {data: 'requiredConsignmentDate',name:'requiredConsignmentDate', 'class': 'text-center',defaultContent: ''},
    {data: 'receivedOrderDate',name:'receivedOrderDate', 'class': 'text-center',defaultContent: ''},
    {data: 'requiredShipDate',name:'requiredShipDate', 'class': 'text-center',defaultContent: ''},
    {data: 'planStartDate',name:'planStartDate', 'class': 'text-center',defaultContent: ''},
    {data: 'planEndDate',name:'planEndDate', 'class': 'text-center',defaultContent: ''},
    {data: 'lotCode',name:'lotCode', 'class': 'text-center',defaultContent: '',
    	render: function (data, operType, row, meta) {
        	return VALUES_MAP_LOT_CODE && VALUES_MAP_LOT_CODE[data] ? VALUES_MAP_LOT_CODE[data].text : '';
        }
	},
    {data: 'eo',name:'eo', 'class': 'text-center',defaultContent: '',
		render: function (data, operType, row, meta) {
        	return VALUES_MAP_EMERGENT_TYPE && VALUES_MAP_EMERGENT_TYPE[data] ? VALUES_MAP_EMERGENT_TYPE[data].text : '';
        }
	},
    {data: 'wkorder',name:'wkorder', 'class': 'text-center',defaultContent: ''},
    {data: 'createdBy',name:'createdBy', 'class': 'text-center',defaultContent: ''},
    {data: 'createdDate',name:'createdDate', 'class': 'text-center',defaultContent: ''},
    {
        data: "id",
        defaultContent: '',
        sortable: false,
        'class': 'text-center',
        render: function (data, type, row, meta) {
            return '<a class="btn btn-default btn-xs" href="'+rootUrl+'/plan/customerOrderDetail/' + ($("#requiredConsignmentDate").val() == null ? '' : $("#requiredConsignmentDate").val() + '/') + row.id + '"><i class="fa fa-list"></i></a>';
        }
      },
    {
      data: "",
      defaultContent: '',
      sortable: false,
      'class': 'text-center',
      render: function (data, type, row, meta) {
        return ('<div class="btn-group">' +
//            '<a class="btn btn-default btn-xs" title="查看明细" href="' + baseUrl + '/edit/' + row.id + '"><i class="fa fa-edit"></i></a>' +
            '<a class="btn btn-default btn-xs del" title="删除" href="#"><i class="fa fa-trash-o"></i></a>' +
            '</div>' +
            '&nbsp;&nbsp;');
      }
    }]
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
   
  $('#search').on("click", function (e) {
	  	var plant = $('.search-form').find('select#plant').val();
	  	var searchTime = $('#requiredConsignmentDate').val();
	  	if(searchTime) {
	  		console.log(searchTime)
	  		var searchStart = searchTime.split(' - ')[0];
		  	var searchEnd = searchTime.split(' - ')[1];
		  	var searchTimeCha = (new Date(searchEnd).getTime() - new Date(searchStart).getTime())/1000/60/60/24;
		  	console.log(searchTimeCha)
		  	if(searchTimeCha > 60) {
		  		bootbox.alert('客户订单单次查询日期范围最大值为60天！')
		  		return false;
		  	}
	  	}
//	  	else {
//	  		bootbox.alert('请选择请求交货日期');
//	  		return false;
//	  	}
	  	
	  	var customerId = $.trim($('.search-form').find('select#customerId').val());
	  	var part = $.trim($('.search-form').find('select#part').val());
	    var customerOrderNo = $('.search-form').find('input#customerOrderNo').val();
	    table.column('plant:name').search(plant);
	    table.column('customerId:name').search(customerId);
	    table.column('part:name').search(part);
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
