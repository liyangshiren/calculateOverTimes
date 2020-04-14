$(document).ready(function () {

  $("#partNo").inputarea();
	
  var table = $('table#table').DataTable({
	scrollX : true,
	autoWidth : true,
    ajax : {
		url : baseUrl + '/datatable',
		type : "POST",
		data : function(d) {
			d.partNo = $.trim($("#partNo").val());
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
    {data: 'no',name:'no','class': 'text-center',defaultContent: ''}, 
    {data: 'name',name:'name','class': 'text-center',defaultContent: ''}, 
    {data: 'nameCS',name:'nameCS','class': 'text-center',defaultContent: ''}, 
    {data: 'nameE',name:'nameE','class': 'text-center',defaultContent: ''}, 
    {data: 'nameES',name:'nameES','class': 'text-center',defaultContent: ''}, 
    {
        data: 'unit',
        defaultContent: '',
        render: function (data, type, row, meta) {
        	return VALUES_MAP_DICT_BUSINESS_SAP && VALUES_MAP_DICT_BUSINESS_SAP[data] ? VALUES_MAP_DICT_BUSINESS_SAP[data].text : '';
        }
    }, 
    //{data: 'custodian.username', name:'custodian', 'class': 'text-center',defaultContent: ''}, 
//    {data: 'pack', name:'pack', 'class': 'text-center',defaultContent: '',
//    	render: function (data, type, row, meta) {
//    		if(data)
//    			return data.no + "-" + data.name;
//    		return "";
//        }
//    }, 
//    {data: 'linePackageNum', name:'linePackageNum', 'class': 'text-center',defaultContent: ''}, 
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
  
  table.on('click', '.inTime', function () {
	    var that = this;
	    var data = table.row($(this).parents('tr')).data();
	    var id = data.id;
	    var inTime = data.inTime;
	    $.get(baseUrl + "/inTime", {
	    	inTime: !inTime,
	      ids: id
	    }, function (res) {
	      if (res) {
	        data.inTime = !inTime;
	        $(that).find("i").removeClass("fa-" + (inTime ? "check-" : "") + "square-o").addClass("fa-" + (!inTime ? "check-" : "") + "square-o");
	        toastr.info('操作成功!');
	      }

	    });
	  });
  
  table.on('click', '.repackage', function () {
	    var that = this;
	    var data = table.row($(this).parents('tr')).data();
	    var id = data.id;
	    var repackage = data.repackage;
	    $.get(baseUrl + "/repackage", {
	    	repackage: !repackage,
	      ids: id
	    }, function (res) {
	      if (res) {
	        data.repackage = !repackage;
	        $(that).find("i").removeClass("fa-" + (repackage ? "check-" : "") + "square-o").addClass("fa-" + (!repackage ? "check-" : "") + "square-o");
	        toastr.info('操作成功!');
	      }

	    });
	  });
  
  table.on('click', '.consignment', function () {
	    var that = this;
	    var data = table.row($(this).parents('tr')).data();
	    var id = data.id;
	    var consignment = data.consignment;
	    $.get(baseUrl + "/consignment", {
	    	consignment: !consignment,
	      ids: id
	    }, function (res) {
	      if (res) {
	        data.consignment = !consignment;
	        $(that).find("i").removeClass("fa-" + (consignment ? "check-" : "") + "square-o").addClass("fa-" + (!consignment ? "check-" : "") + "square-o");
	        toastr.info('操作成功!');
	      }

	    });
	  });
  
  table.on('click', '.fz', function () {
	    var that = this;
	    var data = table.row($(this).parents('tr')).data();
	    var id = data.id;
	    var fz = data.fz;
	    $.get(baseUrl + "/fz", {
	    	fz: !fz,
	      ids: id
	    }, function (res) {
	      if (res) {
	        data.fz = !fz;
	        $(that).find("i").removeClass("fa-" + (fz ? "check-" : "") + "square-o").addClass("fa-" + (!fz ? "check-" : "") + "square-o");
	        toastr.info('操作成功!');
	      }

	    });
	  });
  
  table.on('click', '.multipoint', function () {
	    var that = this;
	    var data = table.row($(this).parents('tr')).data();
	    var id = data.id;
	    var multipoint = data.multipoint;
	    $.get(baseUrl + "/multipoint", {
	    	multipoint: !multipoint,
	      ids: id
	    }, function (res) {
	      if (res) {
	        data.multipoint = !multipoint;
	        $(that).find("i").removeClass("fa-" + (multipoint ? "check-" : "") + "square-o").addClass("fa-" + (!multipoint ? "check-" : "") + "square-o");
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
    var name = $.trim($('.search-form').find('input#name').val());
    var plant = $('.search-form').find('select#plant').val();
    //var no = $('.search-form').find('input#no').val();
//    var repackage = $('.search-form').find('select#repackage').val();
    table.column('name:name').search(name);
    table.column('plant:name').search(plant);
    //table.column('no:name').search(no);
//	table.column('repackage:name').search(repackage);
    table.draw();
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
  
  //导出 动态组织form提交
  $(".btn.export").on("click", function (e) {
	console.log(table);
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
