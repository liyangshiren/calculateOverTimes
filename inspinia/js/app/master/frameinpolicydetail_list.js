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
        name: 'type',
        data: 'type',
        visible : false
    }, {
        data: 'type',
        render: function (data, type, row, meta) {
          return VALUES_MAP_DICT_DETAIL_TYPE && VALUES_MAP_DICT_DETAIL_TYPE[data] ? VALUES_MAP_DICT_DETAIL_TYPE[data].text : data;
        }
    }, {
        name: 'value',
        data: 'value',
        visible : false
    }, {
        data: 'value',
        render: function (data, type, row, meta) {
        	if (row.type == 3){
        		return VALUES_MAP_DICT_TYPE && VALUES_MAP_DICT_TYPE[data] ? VALUES_MAP_DICT_TYPE[data].text : "";
        	}
        	return data;
        }
    }, {
        name: 'sortNo',
        data: 'sortNo'
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
  
});
