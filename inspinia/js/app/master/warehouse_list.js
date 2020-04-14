$(document).ready(function () {
  var table = $('table#table').DataTable({
    ajax: { // 1. ajaxs使用对象，传关联值的data参数，data参数使用回调得到动态值
      url: baseUrl + '/datatable',
      data: {
        area: function () {
          return paramArea || $('.search-form').find('select[name="area"]').val() || '';
        },
        supplier: function () {
          return $('.search-form').find('select[name="supplier"]').val() || '';
        },
        plant: function () {
          return $('.search-form').find('select[name="plant"]').val() || '';
        },
        warehouseType: function () {
          return $('.search-form').find('select[name="warehouseType"]').val() || '';
        }
      }
    },
    order: [
      [2, 'asc'],
      [3, 'asc']
    ],
    // searchCols: [{ //2. 刪除searchCols
    //   search: paramArea
    // }],
    columns: [{
      data: 'id',
      sortable: false,
      defaultContent: '',
      'class': 'text-center',
      render: function (data, type, row, meta) {
        return '<div class="checkbox"><input type="checkbox" name="ids" value="' + data + '"/><label for="ids"/></div>'
      }
    }, {
      data: 'plant.no',
      defaultContent: ''
    }, {
      name: 'no',
      data: 'no'
    }, {
      name: 'name',
      data: 'name'
    },
//    { name : 'warehouseType', data: 'warehouseType'},
      {name : 'warehouseType',  data : 'warehouseType', defaultContent:'',
        render: function (data, warehouseType, row, meta) {
          return VALUES_MAP_WAREHOUSE_TYPE && VALUES_MAP_WAREHOUSE_TYPE[data] ? VALUES_MAP_WAREHOUSE_TYPE[data].text : '';
        }
      },{
        data: '',
        defaultContent: '',
        sortable: false,
        'class': 'text-center',
        render: function (data, type, row, meta) {
          return '<a class="btn btn-default btn-xs" href="' + baseUrl + '/suppl/' + row.id + '"><i class="fa fa-list"></i></a>';
        }
      }, {
        data: "id",
        defaultContent: '',
        sortable: false,
        'class': 'text-center',
        render: function (data, type, row, meta) {
          return '<a class="btn btn-default btn-xs" href="' + rootUrl + '/master/dloc/' + (paramArea == null ? '' : paramArea + '/') + row.id + '"><i class="fa fa-list"></i></a>';
        }
      }, {
        data: "enabled",
        defaultContent: '',
        sortable: false,
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

  //工厂下拉搜索
  $("#plant").select2({
    ajax: {
      url: rootUrl + "/api/master/plants",
    }
  });
  //供应商下拉搜索
  $("#supplier").linkSelect2("plant", rootUrl + "/api/master/suppliers", "plant");

  $('.search-form').on("submit", function (e) {
    var no = $('.search-form').find('input[name="no"]').val();
    var name = $('.search-form').find('input[name="name"]').val();
    var supplier = $('.search-form').find('select[name="supplier"]').val();
    var warehouseType = $('.search-form').find('select[name="warehouseType"]').val();
    table.column('no:name').search(no);
    table.column('name:name').search(name);
    table.column('supplier:name').search(supplier);
    table.column('warehouseType:name').search(warehouseType);
    table.draw();
    //阻止表单submit
    return false;
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

});
