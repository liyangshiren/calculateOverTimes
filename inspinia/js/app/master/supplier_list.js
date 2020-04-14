$(document).ready(function () {
  var table = $('table#table').DataTable($.extend({scrollX:true}, {
	autoWidth : true,
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
    {data: 'plant.id', name: 'plant', 'class': 'text-center', defaultContent: '', visible : false}, 
    {data: 'plant.no', name: 'plantNo', defaultContent: ''}, 
    {data: 'no', name : 'no', 'class': 'text-center',defaultContent: ''}, 
    {data: 'name', name: 'name', 'class': 'text-center',defaultContent: '',
    	render: function (data, type, row, meta) {
	      return '<a href="' + baseUrl + '/info/' + row.id + '">'+data+'</a>';
	    }
    }, 
    //{data: 'supplDunsNo',name : 'supplDunsNo', 'class': 'text-center',defaultContent: ''}, 
    {data: 'email','class': 'text-center',defaultContent: ''}, 
    //{data: 'addressC','class': 'text-center',defaultContent: ''}, 
    //{data: 'addressE','class': 'text-center',defaultContent: ''}, 
    {data: 'contact1','class': 'text-center',defaultContent: ''}, 
    {data: 'phone1','class': 'text-center',defaultContent: ''}, 
    //{data: 'fax1','class': 'text-center',defaultContent: ''}, 
    {data: 'mobile1','class': 'text-center',defaultContent: ''}/*, 
    {
      data: "multiPointSuppl",
      defaultContent: '',
      'class': 'text-center',
      render: function (data, type, row, meta) {
        var result = '<a class="btn btn-xs btn-default multiPointSuppl" href="javascript:;">';
        if (data) {
          result += '<i title="是否多点供应商" class="fa fa-check-square-o"/>';
        } else {
          result += '<i title="是否多点供应商" class="fa fa-square-o"/>';
        }
        result += '</a>';
        return result;
      }
    }*/,
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
  }));
  
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
  
  table.on('click', '.multiPointSuppl', function () {
	    var that = this;
	    var data = table.row($(this).parents('tr')).data();
	    var id = data.id;
	    var multiPointSuppl = data.multiPointSuppl;
	    $.get(baseUrl + "/multiPointSuppl", {
	    	multiPointSuppl: !multiPointSuppl,
	      ids: id
	    }, function (res) {
	      if (res) {
	        data.multiPointSuppl = !multiPointSuppl;
	        $(that).find("i").removeClass("fa-" + (multiPointSuppl ? "check-" : "") + "square-o").addClass("fa-" + (!multiPointSuppl ? "check-" : "") + "square-o");
	        toastr.info('操作成功!');
	      }

	    });
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
    var plant = $('.search-form').find('select#plant').val();
    var no = $('.search-form').find('input#no').val();
    var name = $('.search-form').find('input#name').val();
    //var supplDunsNo = $('.search-form').find('input#supplDunsNo').val();
    
    table.column('plant:name').search(plant);
    table.column('no:name').search(no);
    table.column('name:name').search(name);
    //table.column('supplDunsNo:name').search(supplDunsNo);
    table.draw();
    return false;
  });
  
  //工厂下拉搜索
  $("#plant").select2({
    ajax: {
      url: rootUrl + "/api/master/plants",
    }
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
