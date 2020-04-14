$(document).ready(function () {
  var table = $('table#table').DataTable({
    scrollX : true,
	autoWidth : true,
	responsive: true,
    ajax: {
    	url:baseUrl + '/datatable',
    	data: function(d){
    		d["type"]= $('.search-form').find('select#type').val();
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
    }, {
        name: 'plant',
        data: "plant.id",
        defaultContent: '',
        visible : false
    }, {
        data: "plant.no",
        defaultContent: ''
    }, {
      data: 'no', name: 'no', 'class': 'text-center'
    }, {
      data: 'name', name: 'name', 'class': 'text-center'
    }, {
        name: 'type',
        data: "type",
        visible : false
    }, {
        data: "type",
        defaultContent: '',
        render: function (data, type, row, meta) {
            return VALUES_MAP_DICT_TYPE && VALUES_MAP_DICT_TYPE[data] ? VALUES_MAP_DICT_TYPE[data].text : '';
        }
    },{
      data: 'use', name: 'use', 'class': 'text-center', visible : false
    }, {
        data: "use",
        defaultContent: '',
        render: function (data, type, row, meta) {
            return VALUES_MAP_DICT_USE && VALUES_MAP_DICT_USE[data] ? VALUES_MAP_DICT_USE[data].text : '';
        }
    }, 
    {data: 'length', name: 'length', defaultContent: '', 'class': 'text-center'}, 
    {data: 'width', name: 'width', defaultContent: '', 'class': 'text-center'}, 
    {data: 'height', name: 'height', defaultContent: '', 'class': 'text-center'}, 
    {data: 'capacity', name: 'capacity', defaultContent: '', 'class': 'text-center'}, 
    {data: 'weight', name: 'weight', defaultContent: '', 'class': 'text-center'},
    {data: 'lastModifiedBy',name:'lastModifiedBy', 'class': 'text-center',defaultContent: ''},
    {data: 'lastModifiedDate',name:'lastModifiedDate', 'class': 'text-center',defaultContent: ''},
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
    },{
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
    var plant = $('.search-form').find('select#plant').val();
    //var type = $('.search-form').find('select#type').val();
    var use = $('.search-form').find('select#use').val();
    var no = $('.search-form').find('input#no').val();
    var name = $('.search-form').find('input#name').val();
    //table.column('type:name').search(type);
    table.column('use:name').search(use);
    table.column('plant:name').search(plant);
    table.column('no:name').search(no);
    table.column('name:name').search(name);
    table.draw();
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
