/**
 * 零件供应商关系
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
	    {data: 'part.plant.id', name: 'plant', defaultContent: '', visible : false}, 
	    {data: 'part.id', name: 'partId', defaultContent: '', visible : false}, 
	    {data: 'part.no', name: 'partNo', defaultContent: '', 'class': 'text-center'}, 
	    {data: 'part.name', name: 'partName', defaultContent: '', 'class': 'text-left'}, 
	    {data: 'suppl.id', name: 'supplId', defaultContent: '', visible : false}, 
	    {data: 'suppl.no', name: 'supplNo', defaultContent: '', 'class': 'text-center'}, 
	    {data: 'suppl.name', name: 'supplName', defaultContent: '', 'class': 'text-left'}, 
	    {data: 'pack.id', name: 'packId', defaultContent: '', visible : false}, 
	    {data: 'pack.no', name: 'packNo', defaultContent: '', 'class': 'text-center'}, 
	    {data: 'packageQty', name: 'packageQty', defaultContent: '', 'class': 'text-center'}, 
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
    var supplId = $('.search-form').find('select#supplId').val();
    var packId = $('.search-form').find('select#packId').val();
    table.column('plant:name').search(plant);
    table.column('partId:name').search(partId);
    table.column('supplId:name').search(supplId);
    table.column('packId:name').search(packId);
    table.draw();
    return false;
  });
  
  $('#clear').on("click", function (e) {
	$("#partId").val('').trigger("change");
	$("#supplId").val('').trigger("change");
	$("#packId").val('').trigger("change");
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
	// 供应商下拉搜索
	$("#supplId").linkSelect2("plant", rootUrl + "/api/master/suppliers", "plant");
	// 包装下拉搜索
	$("#packId").linkSelect2("plant", rootUrl + "/api/master/packs", "plant");
	
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
