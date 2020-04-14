/**
 * 零件包装库位关系
 */
$(document).ready(function () {
  var table = $('table#table').DataTable({
    ajax: baseUrl + '/datatable',
    order : [ [ 3, 'asc' ] ],
    columns: [{
	      data: 'id',
	      sortable: false,
	      'class': 'text-center',
	      defaultContent: '',
	      render: function (data, type, row, meta) {
	        return '<div class="checkbox"><input type="checkbox" name="ids" value="' + data + '"/><label for="ids"/></div>'
	      }
	    },
	    {data: 'plant.id', name: 'plant', defaultContent: '', visible : false},
	    {data: 'plant.no', name: 'plantNo', defaultContent: '', 'class': 'text-center'}, 
	    {data: 'partId', name: 'partId', defaultContent: '', visible : false}, 
	    {data: 'part.no', name: 'partNo', defaultContent: '', 'class': 'text-center'}, 
	    {data: 'locId', name: 'locId', defaultContent: '', visible : false}, 
	    {data: 'loc.no', name: 'locNo', defaultContent: '', 'class': 'text-center'}, 
	    {
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
	    },
        {data: 'id', sortable: false, 'class': 'text-center',
	      render: function (data, type, row, meta) {
	        return ('<div class="btn-group">' +
	            '<a class="btn btn-default btn-xs" title="修改" href="' + baseUrl + '/edit/' + row.id + '"><i class="fa fa-edit"></i></a>' +
	            '<a class="btn btn-default btn-xs del" title="删除" href="#"><i class="fa fa-trash-o"></i></a>' +
	            '</div>&nbsp;&nbsp;');
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
    var plant = $('.search-form').find('select#plant').val();
    var partId = $('.search-form').find('select#partId').val();
    var locId = $('.search-form').find('select#locId').val();
    table.column('plant:name').search(plant);
    table.column('partId:name').search(partId);
    table.column('locId:name').search(locId);
    table.draw();
    return false;
  });
  
  table.on('click', '.enable', function () {
	  var that = this;
	  var data = table.row($(this).parents('tr')).data();
	  var id = data.id;
	  var enabled = data.enabled;
	  var isdefault = data.isdefault;
	  var partId = data.partId;
	  $.get(baseUrl + "/enable/new", {
	    enabled: !enabled,
	    isdefault: isdefault,
	    ids: id,
	    partId: partId
	  }, function (res) {
		  
		if(res == -2){
			toastr.error('【默认】状态的用户关系不能取消激活!');
		} else {
			if (res) {
				data.enabled = !enabled;
				$(that).find("i").removeClass("fa-" + (enabled ? "check-" : "") + "square-o").addClass("fa-" + (!enabled ? "check-" : "") + "square-o");
				toastr.info('操作成功!');
				//勾选成功则刷新页面
		        parent.location.reload();
			}
		}
	
	  });
	});
  
  $('#clear').on("click", function (e) {
	$("#plant").val('').trigger("change");
	$("#partId").val('').trigger("change");
	$("#locId").val('').trigger("change");
    table.columns().search('').draw();
  });
  
	//工厂下拉搜索
	$("#plant").select2({
		ajax : {
			url : rootUrl + "/api/master/plants",
		}
	});
	//零件号下拉搜索
	$("#partId").linkSelect2("plant", rootUrl + "/api/master/parts", "plant");
	// 包装库位下拉搜索
	$("#locId").linkSelect2("plant", rootUrl + "/api/master/locs", "plant");
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
