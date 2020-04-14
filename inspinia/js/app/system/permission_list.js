$(document).ready(function () {
  var moduleTable = $('#moduleTable').DataTable({
    ajax: rootUrl + '/system/module/datatable',
    lengthChange: false,
    searching: false,
    info: false,
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
      },
      {
        data: 'name'
      },
      {
        data: "",
        defaultContent: '',
        sortable: false,
        'class': 'text-center',
        render: function (data, type, row, meta) {
          return ('<a class="module edit" title="修改" data-id=' + row.id + '" data-toggle="modal" data-target="#myModal4"><i class="fa fa-edit"></i></a>');
        }
      }
    ]
  });

  // modal关闭时清除form
  $("#myModal4").on('hidden.bs.modal', function () {
    console.log($(this));
    $(this).closest('form').clearForm();
  });
  // 编辑
  moduleTable.on('click', '.edit', function () {
    var data = moduleTable.row($(this).parents('tr')).data();
    $('#moduleForm').find('input[name="id"]').val(data.id);
    $('#moduleForm').find('input[name="version"]').val(data.version);
    $('#moduleForm').find('input[name="name"]').val(data.name);
    $('#moduleForm').find('input[name="description"]').val(data.description);
  });
  // 模块表单
  $('#moduleForm').ajaxForm(function () {
    moduleTable.search('').draw();
    $("#myModal4").modal('hide');
  });

  // 权限列表
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
      },
      {
        data: 'name'
      },
      {
        data: 'aclPattern'
      },
      {
        data: "",
        defaultContent: '',
        sortable: false,
        'class': 'text-center',
        render: function (data, type, row, meta) {
          return (
              row.editable ? '<div class="btn-group">' +
              '<a class="btn btn-default btn-xs" title="修改" href="' + baseUrl + '/edit/' + row.id + '"><i class="fa fa-edit"></i></a>' +
              '<a class="btn btn-default btn-xs del" title="删除" href="#"><i class="fa fa-trash-o"></i></a>' +
              '</div>' +
              '&nbsp;&nbsp;' : '') +
            '<div class="btn-group">' +
            '<a class="btn btn-default btn-xs resetpwd" title="重置密码" href="javascript:;">重置密码</a>' +
            '</div>';
        }
      }, {
        data: 'editable',
        visible: false
      }
    ]
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
