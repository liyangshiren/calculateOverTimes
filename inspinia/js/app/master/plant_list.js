$(document).ready(function () {
  var table = $('table#table').DataTable({
    ajax: baseUrl + '/datatable',
    order: [
      [1, 'asc']
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
      name: 'no',
      data: 'no'
    }, /**{
      name: 'sapPlantNo',
      data: 'sapPlantNo'
    }, **/{
      name: 'name',
      data: 'name'
    }, {
      name: 'nameCS',
      data: 'nameCS'
    }, {
      name: 'addr',
      data: 'addr'
    }, {
      data: 'lastModifiedDate',
      'class': 'text-center',
      defaultContent: ''
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

  $('.search-form').on("submit", function (e) {
    var no = $('.search-form').find('input[name="no"]').val();
    //var sapPlantNo = $('.search-form').find('input[name="sapPlantNo"]').val();
    var name = $('.search-form').find('input[name="name"]').val();
    table.column('no:name').search(no);
    //table.column('sapPlantNo:name').search(sapPlantNo);
    table.column('name:name').search(name);
    table.draw();
    //阻止表单submit
    return false;
  });

});
