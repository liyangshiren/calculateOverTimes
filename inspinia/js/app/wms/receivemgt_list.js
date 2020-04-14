$(document).ready(function () {
	$("#part").select2({
		ajax : {
			url : rootUrl + "/api/master/parts",
			data : function(params) {
				params.q = params.term;
				return params;
			}
		}
	});
	
  var table = $('table#table').DataTable({
    ajax: {
    	url:baseUrl + '/datatable',
    	data: function(d){
    		var requiredTimes = $("#requiredTimeRange").val();
    		d.requiredTimes = requiredTimes;
    		d.sdsNo = $("#sdsNo").val();
    		d.part = $("#part").val();
    		d.dock = $("#dock").val();
    		d.billType = $("#billType").val();
    		d.status = $('.search-form').find('select[name="status"]').val();
    		return d;
    	}
    },
    order: [
      [9, 'DESC']
    ],
    columns : [{
      data: 'id',
      sortable: false,
      defaultContent: '',
      'class': 'text-center',
      render: function (data, type, row, meta) {
        return '<div class="checkbox"><input type="checkbox" printed="'+(row.billType == '90' || row.billType == '98' || row.billType == '20' || row.billType == '1'|| row.billType == '80')+'" name="ids" value="' + data + '"/><label for="ids"/></div>'
      }
    }, {
        name: 'sdsNo',
        data: 'sdsNo'
    }, {
        name: 'billType',
        data: 'billType',
        visible : false
    }, {
      data: 'billType',
      render: function (data, type, row, meta) {
        return VALUES_MAP_DICT_TYPE && VALUES_MAP_DICT_TYPE[data] ? VALUES_MAP_DICT_TYPE[data].text : '';
      }
    }, {
        name: 'status',
        data: 'status',
        visible : false
    }, {
      data: 'status',
      render: function (data, type, row, meta) {
        return VALUES_MAP_DICT_STATUS && VALUES_MAP_DICT_STATUS[data] ? VALUES_MAP_DICT_STATUS[data].text : '';
      }
    }, {
      name: 'dock',
      data: 'dock.id',
      defaultContent: '',
      visible : false
    }, {
      data: 'dock.name',
      defaultContent: ''
    }, {
      name: 'requiredTime',
      data: 'requiredTime'
    }, {
      name: 'issuesTime',
      data: 'issuesTime'
    }, {
      name: 'supplNo',
      data: 'suppl.no'
    }, {
        data: "id",
        defaultContent: '',
        sortable: false,
        'class': 'text-center',
        render: function (data, type, row, meta) {
          return '<a class="btn btn-default btn-xs" href="'+rootUrl+'/wms/receivemgtpart/'+ row.id + '"><i class="fa fa-list"></i></a>';
        }
    }, {
      data: "",
      defaultContent: '',
      sortable: false,
      'class': 'text-center',
      render: function (data, type, row, meta) {
    	  var div = '<div class="btn-group">';
          if ((row.billType == '90' || row.billType == '98' || row.billType == '20'|| row.billType == '80') && row.status == '1') {
	        div += '<a class="btn btn-default btn-xs" title="修改" href="' + baseUrl + '/edit/' + row.id + '"><i class="fa fa-edit"></i></a>' +
	          '<a class="btn btn-default btn-xs del" title="删除" href="#"><i class="fa fa-trash-o"></i></a>';
          }
          if (row.billType == '90' || row.billType == '98' || row.billType == '20' || row.billType == '80') {
  	        div += '<a class="btn btn-default btn-xs print" title="打印" href="javascript:window.open(\'' + baseUrl + '/print/' + row.id + '\')"><i class="fa fa-print"></i></a>' +
  	          '</div>' +
  	          '&nbsp;&nbsp;';
          }
          div += '</div>&nbsp;&nbsp;';
          return div;
      }
    }]
  });

  $('#requiredTimeRange').daterangepicker({
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
    $('#requiredTimeRange').val(start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));
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

  table.on('click', '.enable', function () {
    var that = this;
    var data = table.row($(this).parents('tr')).data();
    var id = data.id;
    var enabled = data.enabled;
    $.get(baseUrl + "/enable", {
      enabled: !enabled,
      ids: id
    }, function (res) {
      if (res) {
        data.enabled = !enabled;
        $(that).find("i").removeClass("fa-" + (enabled ? "check-" : "") + "square-o").addClass("fa-" + (!enabled ? "check-" : "") + "square-o");
        toastr.info('操作成功!');
      }
    });
  });

  $('#search').on("click", function (e) {
    var sdsNo = $('.search-form').find('input[name="sdsNo"]').val();
    var dock = $('.search-form').find('select[name="dock"]').val();
    table.column('sdsNo:name').search(sdsNo);
    table.column('dock:name').search(dock);
    table.draw();
    //阻止表单submit
    return false;
  });
  
  $(".btn.print").on("click", function (e) {
    var ids = [];
    var exitsNotPrinted = false;
    $('#table>tbody input:checked').each(function (i, item) {
    	if ($(item).attr("printed") == "true") {
	      ids.push($(item).val());
	    } else {
	    	exitsNotPrinted = true;
	    }
    });
    var confirmTitle = "确定要打印选中的数据吗?";
    if (exitsNotPrinted){
    	confirmTitle = "确定要打印选中的数据（自动过滤除寄售或白条或分装以外的单据）吗?";
    }
    	
    $("#printForm #ids").val(ids.join(","));
    if (ids.length > 0) {
      bootbox.confirm(confirmTitle, function (result) {
		if (!result) {
			return;
		} else {
			for (var i = 0; i < ids.length; i++) {
				var url = baseUrl + '/print/' + ids[i]
				window.open(url);
			}
		}
      });
    } else {
	  var confirmTitle = "请选择要打印的数据.";
      if (exitsNotPrinted){
    	confirmTitle = "请选择要打印的数据（自动过滤除寄售或白条或分装以外的单据）.";
      }
      bootbox.alert(confirmTitle);
    }
  });
  
  	//导出 动态组织form提交
	$(".btn.export").on("click", function (e) {
		$("#exportForm .param").remove();
		var $frm = $("#exportForm");
		var array = $('.search-form').serializeArray();
　　　　	var rebateMap = {};
		for (i = 0, length = array.length; i < length; i++) {
　　　　		key = array[i].name;
			value = array[i].value;
			$frm.append($('<input class="param" type="hidden" name = "' + key + '" value = "' + value + '" />')); 
			rebateMap[key] = value;
		}
		var newData = JSON.stringify(rebateMap);
	　	$.ajax({
	　		url:baseUrl + '/qTotal',
	　		type : 'get',
	　		dataType:"json",
	   		data: {
	   			"paramStr" : newData
	    	},
			success : function(data) {
				if(data == 1){
					bootbox.alert("fail:导出数据时，请输入查询条件导出！");
				} else if(data == 2){
					bootbox.alert("fail:查询数据超出限值，请精确查询再做导出!");
				} else if(data == 3){
					bootbox.alert("fail:导出时出现异常，请重新查询再导出!");
				} else {
					$frm.append($('<input class="param" type="hidden" name = "requiredTimes" value = "' + $("#requiredTimeRange").val() + '" />')); 
					$frm.append($('<input class="param" type="hidden" name = "part" value = "' + $("#part").val() + '" />')); 
					$frm.submit();
				}
			},
	    	error : function(data) {
	    		bootbox.alert("fail:导出时出现异常，请重新查询再导出!");
			}
		});
		// 阻止默认行为
		e.preventDefault();
		return false;  
	});
});
