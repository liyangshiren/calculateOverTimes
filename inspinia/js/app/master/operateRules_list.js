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
    	name: 'operateType',
        data: 'operateType',
        visible: false
    }, {
        data: 'operateType',
        name: 'operateType',
        defaultContent: '',
        render: function (data, operateType, row, meta) {
        	return VALUES_MAP_OPERATE_TYPE && VALUES_MAP_OPERATE_TYPE[data] ? VALUES_MAP_OPERATE_TYPE[data].text : '';
        }
    }, {
      name: 'fromPlant',
      data: 'fromPlant.id',
      visible: false
    }, {
        name: 'fromPlantNo',
        data: 'fromPlant.no',
    }, {
        name: 'fromDloc',
        data: 'fromDloc.id',
        visible: false
    }, {
          name: 'fromDlocNo',
          data: 'fromDloc.no',
    }, {
      name: 'toPlant',
      data: 'toPlant.id',
      visible: false
    }, {
        name: 'toPlantNo',
        data: 'toPlant.no',
    }, {
        name: 'toDloc',
        data: 'toDloc.id',
        visible: false
    }, {
          name: 'toDlocNo',
          data: 'toDloc.no',
    }, {
      name: 'description',
      data: 'description'
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


  $('.search-form').on("submit", function (e) {
    var operateType = $('.search-form').find('select[name="operateType"]').val();
    var fromPlant = $('.search-form').find('select[name="fromPlant"]').val();
    var toPlant = $('.search-form').find('select[name="toPlant"]').val();
    var fromDloc = $('.search-form').find('select[name="fromDloc"]').val();
    var toDloc = $('.search-form').find('select[name="toDloc"]').val();
	table.column('operateType:name').search(operateType);
    table.column('fromPlant:name').search(fromPlant);
    table.column('toPlant:name').search(toPlant);
    table.column('fromDloc:name').search(fromDloc);
    table.column('toDloc:name').search(toDloc);
    table.draw();
    //阻止表单submit
    return false;
  });
  
});
