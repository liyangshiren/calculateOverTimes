$(document).ready(function () {
  var table = $('table#table').DataTable({
    ajax: baseUrl + '/datatable',
    order: [
      [2, 'asc']
    ],
    columns: [{
      data: 'id',
      sortable: false,
      defaultContent: '',
      'class': 'text-center',
      render: function (data, type, row, meta) {
        return '<div class="checkbox"><input type="checkbox" name="ids" value="' + data + '"/><label for="ids"/></div>'
      }
    }, {
        name: 'plant',
        data: 'plant.id',
        defaultContent: '',
        visible : false
    }, {
        data: 'plant.no',
        defaultContent: ''
    },
    //     {
    //     name: 'warehouse',
    //     data: 'warehouse.id',
    //     defaultContent: '',
    //     visible : false
    // }, {
    //     data: 'warehouse',
    //     defaultContent: '',
    //     render: function (data, type, row, meta) {
    //         return data.no + "-" + data.name;
    //     }
    // },
        {
        name: 'part',
        data: 'part.id',
        defaultContent: '',
        visible : false
    }, {
        data: 'part.no',
        defaultContent: ''
    }, {
        data: 'part.name',
        defaultContent: ''
    }, {
        name: 'priority',
        data: 'priority'
    }, {
        name: 'ruleCode',
        data: 'ruleCode',
        visible : false
    }, {
        data: 'ruleCode',
        render: function (data, type, row, meta) {
          return VALUES_MAP_DICT_TYPE && VALUES_MAP_DICT_TYPE[data] ? VALUES_MAP_DICT_TYPE[data].text : '';
        }
    /*}, {
        name: 'dloc',
        data: 'dloc.id',
        defaultContent: '',
        visible : false
    }, {
        data: 'dloc.no',
        defaultContent: ''*/
    }, {
        name: 'loc',
        data: 'loc.id',
        defaultContent: '',
        visible : false
    }, {
        data: 'loc.no',
        defaultContent: ''
    }, {
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
    }, {
        data: "",
        defaultContent: '',
        sortable: false,
        'class': 'text-center',
        render: function (data, type, row, meta) {
          return ('<div class="btn-group">' +
              '<a class="btn btn-default btn-xs" title="修改" href="' + baseUrl + '/edit/' + row.id + '"><i class="fa fa-edit"></i></a>' +
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
    var plant = $('.search-form').find('select[name="plant"]').val();
    // var warehouse = $('.search-form').find('select[name="warehouse"]').val();
    var part = $('.search-form').find('select[name="part"]').val();
    var ruleCode = $('.search-form').find('select[name="ruleCode"]').val();
//    var dloc = $('.search-form').find('select[name="dloc"]').val();
    var loc = $('.search-form').find('select[name="loc"]').val();
    
    table.column('plant:name').search(plant);
    // table.column('warehouse:name').search(warehouse);
    table.column('part:name').search(part);
    table.column('ruleCode:name').search(ruleCode);
//    table.column('dloc:name').search(dloc);
    table.column('loc:name').search(loc);
    table.draw();
    //阻止表单submit
    return false;
  });
	

	$("#plant").select2({
		ajax : {
			url : rootUrl + "/api/master/plants"
		}
	});
	$("#warehouse").linkSelect2("plant", rootUrl + "/api/master/warehouses", "plant");
	
	$("#part").linkSelect2("plant", rootUrl + "/api/master/parts", "plant");
	
	$("#dloc").linkSelect2("warehouse", rootUrl + "/api/master/dlocs", "warehouse");
	
	$("#loc").linkSelect2("dloc", rootUrl + "/api/master/locs", "dloc");

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
});
