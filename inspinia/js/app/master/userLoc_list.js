$(document).ready(function () {

//  $("#operType").inputarea();
	
  var table = $('table#table').DataTable({
    ajax : {
		url : baseUrl + '/datatable',
//		type : "POST",
		data : function(d) {
			d.operType = $("#operType").val();
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
    {data: 'plant.id', name: 'plant', defaultContent: '', visible : false}, 
    {data: 'plant.no','class': 'text-center', defaultContent: ''},
    {data: 'user.id', name: 'user', defaultContent: '', visible : false}, 
    {data: 'user.username','class': 'text-center', defaultContent: ''},
    {data: 'operType',name:'operType','class': 'text-center',defaultContent: '',
    	render: function (data, operType, row, meta) {
        	return VALUES_MAP_OPER_TYPE && VALUES_MAP_OPER_TYPE[data] ? VALUES_MAP_OPER_TYPE[data].text : '';
        }
	}, 
    {data: 'loc.id', name: 'loc', defaultContent: '', visible : false}, 
    {data: 'loc.no','class': 'text-center', defaultContent: ''},
    {
        data: "isdefault",
        defaultContent: '',
        'class': 'text-center',
        render: function (data, type, row, meta) {
          var result = '<a class="btn btn-xs btn-default isdefault" href="javascript:;">';
          if (data != null && data) {
            result += '<i title="默认/非默认" class="fa fa-check-square-o"/>';
          } else {
            result += '<i title="默认/非默认" class="fa fa-square-o"/>';
          }
          result += '</a>';
          return result;
        }
      },
    {
        data: "enabled",
        defaultContent: '',
        'class': 'text-center',
        render: function (data, type, row, meta) {
          var result = '<a class="btn btn-xs btn-default enable" href="javascript:;">';
          if (data) {
            result += '<i title="激活/禁用" class="fa fa-check-square-o"/>';
          } else {
            result += '<i title="激活/禁用" class="fa fa-square-o"/>';
          }
          result += '</a>';
          return result;
        }
      },
    {
      data: "",
      defaultContent: '',
      sortable: false,
      'class': 'text-center',
      render: function (data, type, row, meta) {
        return ('<div class="btn-group">' +
            '<a class="btn btn-default btn-xs" title="编辑" href="' + baseUrl + '/edit/' + row.id + '"><i class="fa fa-edit"></i></a>' +
            '<a class="btn btn-default btn-xs del" title="删除" href="#"><i class="fa fa-trash-o"></i></a>' +
            '</div>' +
            '&nbsp;&nbsp;');
      }
    }]
  });
  
  $('#search').on("click", function (e) {
	  	var plant = $.trim($('.search-form').find('select#plant').val());
	    var user = $('.search-form').find('select#user').val();
	    var operType = $('.search-form').find('select#operType').val();
	    var loc = $('.search-form').find('select#loc').val();
	    
	    table.column('plant:name').search(plant);
	    table.column('user:name').search(user);
	    table.column('operType:name').search(operType);
	    table.column('loc:name').search(loc);
	    table.draw();
	    //阻止表单submit
	    return false;
	  });
  
  $('#clear').on("click", function (e) {
    table.columns().search('').draw();
  });
  
  //工厂下拉搜索
  $("#plant").select2({
    ajax: {
      url: rootUrl + "/api/master/plants",
    }
  });
  
  //库位下拉搜索
  $("#loc").linkSelect2("dloc", rootUrl + "/api/master/locs", "dloc");
  
  //用户下拉搜索
  $("#user").select2({
    ajax: {
      url: rootUrl + "/api/master/users",
    }
  });
  
  table.on('click', '.isdefault', function () {
	    var that = this;
	    var data = table.row($(this).parents('tr')).data();
	    var id = data.id;
	    var isdefault = data.isdefault;
	    var plantId = data.plant.id;
	    var userId = data.user.id;
	    var operType = data.operType;
	    $.get(baseUrl + "/isdefault", {
	    	isdefault: !isdefault,
	    	plantId: plantId,
	    	userId: userId,
	    	operType: operType,
	        ids: id
	    }, function (res) {
	      if(res == -2){
	    	  toastr.warning('不能取消【默认】选择!');  
	      } else {
		      if (res) {
		        data.isdefault = !isdefault;
		        $(that).find("i").removeClass("fa-" + (isdefault ? "check-" : "") + "square-o").addClass("fa-" + (!isdefault ? "check-" : "") + "square-o");
		        toastr.info('操作成功!');
		        //勾选成功则刷新页面
		        parent.location.reload();
		      } else {
		    	  toastr.info('操作失败失败失败!');  
		      }
	      }
	    });
	  });

	table.on('click', '.enable', function () {
	  var that = this;
	  var data = table.row($(this).parents('tr')).data();
	  var id = data.id;
	  var enabled = data.enabled;
	  var isdefault = data.isdefault;
	  $.get(baseUrl + "/enable/new", {
	    enabled: !enabled,
	    isdefault: isdefault,
	    ids: id
	  }, function (res) {
		if(res == -2){
			toastr.error('【默认】状态的用户关系不能取消激活!');
		} else {
			if (res) {
				data.enabled = !enabled;
				$(that).find("i").removeClass("fa-" + (enabled ? "check-" : "") + "square-o").addClass("fa-" + (!enabled ? "check-" : "") + "square-o");
				toastr.info('操作成功!');
			}
		}
	
	  });
	});
	  
	  //导出 动态组织form提交
	  $(".btn.export").on("click", function (e) {
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
  
});
