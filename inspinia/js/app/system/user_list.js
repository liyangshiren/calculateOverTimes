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
      name: 'username',
      data: 'username'
    }, {
      name: 'email',
      data: 'email'
    }, {
      name: 'fullname',
      data: 'fullname'
    }, {
      data: 'lastModifiedDate',
      'class': 'text-center',
      defaultContent: ''
    }, {
      data: "ldap",
      defaultContent: '',
      'class': 'text-center',
      render: function (data, type, row, meta) {
        return data ? '<i class="fa fa-check-square-o"/>':'<i class="fa fa-square-o"/>';
      }
    }, {
        data: "",
        defaultContent: '',
        'class': 'text-center',
        render: function (data, type, row, meta) {
          return data ? '<i class="fa fa-check-square-o"/>':'<i class="fa fa-square-o"/>';
        }
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
        return row.editable ? result : '';
      }
    }, {
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
            '&nbsp;&nbsp;' : '') + (row.admin ? '':
          '<div class="btn-group">' +
          '<a class="btn btn-default btn-xs resetpwd" title="重置密码" href="javascript:;">重置密码</a>' +
          '</div>');
      }
    }, {
      data: 'editable',
      visible: false
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
  table.on('click', '.resetpwd', function () {
    var that = this;
    var data = table.row($(this).parents('tr')).data();
    var id = data.id;
    bootbox.confirm("确定要重置该用户密码吗?", function (e) {
      if (e) {
        $.get(baseUrl + "/resetpwd", {
          ids: id
        }, function (res) {
          if (res) {
            toastr.info("密码重置成功!");
          }
        });
      }
    });
  });
  
  $('.search-form').on("submit", function (e) {
	    var username = $('.search-form').find('input#username').val();
//	    username = username.replace(/(^\s*)|(\s*$)/g, "");
	    var fullname = $('.search-form').find('input#fullname').val();
	    var email = $('.search-form').find('input#email').val();
	    table.column('username:name').search(username);
	    table.column('fullname:name').search(fullname);
	    table.column('email:name').search(email);
	    table.draw();
	    return false;
  });
	  
  $('#clear').on("click", function (e) {
    table.columns().search('').draw();
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
