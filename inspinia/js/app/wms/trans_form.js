$(document).ready(function () {
	$("#plant").select2({
		ajax : {
			url : rootUrl + "/api/master/plants"
		}
	});
	$("#part").linkSelect2("plant",rootUrl + "/api/master/parts","plant");
	$("#fromWarehouse").linkSelect2("part",rootUrl + "/api/master/inventoryByWarehouses","part");
	$("#fromDloc").linkSelect2WithControls([$("#part"),$("#fromWarehouse")],rootUrl + "/api/master/inventoryByDlocs",["part","warehouse"]);
	$("#fromLoc").linkSelect2WithControls([$("#part"),$("#fromDloc")],rootUrl + "/api/master/inventoryByLocs",["part","dloc"]);
	$("#toWarehouse").linkSelect2("plant",rootUrl + "/api/master/warehouses","plant");
	$("#toDloc").linkSelect2("toWarehouse",rootUrl + "/api/master/dlocs","warehouse");
	$("#toLoc").linkSelect2("toDloc",rootUrl + "/api/master/locs","dloc");
	
	var table = $('table#table').DataTable({
	    ajax : {
			url : baseUrl + "/transDatatable",
			type : "POST",
			data : function(d) {
				var plant = $("#plant").val();
				var part = $("#part").val();
				var fromWarehouse = $("#fromWarehouse").val();
				var fromDloc = $("#fromDloc").val();
				var fromLoc = $("#fromLoc").val();
				
				if(part != "" && fromLoc != "") {
					d.plant = plant;
					d.part = part;
					d.warehouse = fromWarehouse;
					d.dloc = fromDloc;
					d.loc = fromLoc;
					d.barcode = $("#barcode").val();
				}else{
					d.plant = 0;
				}
				return d;
			}
		},
		pageLength: 100,
	    order: [
	      [1,"asc"]
	    ],
	    columns: [
	    	{
		      data: 'id',
		      sortable: false,
		      defaultContent: '',
		      'class': 'text-center',
		      render: function (data, type, row, meta) {
		        return '<div class="checkbox"><input inventoryLocId="' + data + '" type="checkbox" name="ids" value="' + data + '"/><label for="ids"/></div>'
		      }
	    	}, 
		    {data: 'batch', name: 'batch', defaultContent: ''}, 
		    {data: 'quantity', name:'quantity','class': 'text-center', defaultContent: ''}, 
		    {data: 'quantity', name:'transQty',
		    	render: function (data, type, row, meta) {
		    		return '<div><input class="form-control" inventoryLocQty="' + data + '" id="inventoryLocQty-'+row.id+'" '
		    		+ (row.barcode==null||row.barcode==''?'':'readonly="readonly"')
		    		+ ' type="text" name="ids" value="' + data + '"/><label for="ids"/></div>'
		    	}
		    }, 
		    {data: 'barcode',name:'barcode', defaultContent: ''}, 
		    { data : 'pack.no', defaultContent:'' }
		],
		fnDrawCallback:function(){
			var plant = $("#plant").val();
			var part = $("#part").val();
			var fromWarehouse = $("#fromWarehouse").val();
			var fromDloc = $("#fromDloc").val();
			var fromLoc = $("#fromLoc").val();
			
			if(part != "" && fromLoc != "") {
				$("input[inventoryLocId]").click(function(e){
					var transQty = 0;
					$('#table>tbody input:checked').each(function (i, item) {
						var id = parseInt($(item).val());
						var qty = $("#inventoryLocQty-"+id).val();
						transQty += parseInt(qty == "" ? "0" : qty);
					});
					$("#transQty").val(transQty);
				});
				
				$(".selectAll").mouseout(function(e){
					var transQty = 0;
					$('#table>tbody input:checked').each(function (i, item) {
						var id = parseInt($(item).val());
						var qty = $("#inventoryLocQty-"+id).val();
						transQty += parseInt(qty == "" ? "0" : qty);
					});
					$("#transQty").val(transQty);
				});
				
				$("input[inventoryLocQty]").change(function(e){
					var transQty = 0;
					$('#table>tbody input:checked').each(function (i, item) {
						var id = parseInt($(item).val());
						var qty = $("#inventoryLocQty-"+id).val();
						transQty += parseInt(qty == "" ? "0" : qty);
					});
					$("#transQty").val(transQty);
				});
			}
		}
  	});
	
	$('#fromLoc').change(function (e) {
		table.draw();
		
		var plant = $("#plant").val();
		var part = $("#part").val();
		var fromWarehouse = $("#fromWarehouse").val();
		var fromDloc = $("#fromDloc").val();
		var fromLoc = $("#fromLoc").val();
		
		if(part != "" && fromLoc != "") {
			$.post(
				baseUrl + "/sumQuantity", {
					plant:plant,
					fromLoc:fromLoc,
					part:part
				},function(sumQuantity) {
					$("#qty").val(sumQuantity);
				}
			);
		 }else{
			 $("#qty").val("");
		 }
	});
	
	$('#barcodeButton').on("click", function (e) {
		table.draw();
	});
	
	$('#clear').on("click", function (e) {
		bootbox.confirm("确定要重置数据吗?", function(result) {
			if (!result) { 
				return; 
			} else {
				window.location.reload();
			}
		}); 
	});

	 $("input#remark1").keyup(function(){
		 var s = $("input#remark1").val();
		 var totalLength = calculateLength(s);	
	     if ( totalLength > 20){
	    	 alert('当前字节长度为：' + totalLength + '，最多只能输入20个字节')
	         $("input#remark1").val("");
	    	 } 
	 });
	 
	 //计算字符串的字节数
	 function calculateLength(s){
		 var totalLength = 0;
		 var i;
		 var charCode;
		 for (i = 0; i < s.length; i++){
			 charCode = s.charCodeAt(i);
			 if (charCode < 0x007f) {
				 totalLength = totalLength + 1;
				 } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
					 totalLength += 2;
					 } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
						 totalLength += 3;
						 }
			 }
		 return totalLength;
		};

	 $("input#remark2").keyup(function(){
		 var s = $("input#remark2").val();
		 var totalLength = calculateLength(s);	
	     if ( totalLength > 20){
	    	 alert('当前字节长度为：' + totalLength + '，最多只能输入20个字节')
	         $("input#remark2").val("");
	    	 } 
	 });
	 
	 $("input#remark3").keyup(function(){
		 var s = $("input#remark3").val();
		 var totalLength = calculateLength(s);	
	     if ( totalLength > 20){
	    	 alert('当前字节长度为：' + totalLength + '，最多只能输入20个字节')
	         $("input#remark3").val("");
	    	 } 
	 });
	
	
	var form = $("#transForm");
	form.validate({
		rules: {
			
		},
		messages: {
			
		}
	});
	
	$("#submitTrans").on("click", function (e) {
		var count = 0;
		var ids = "";
		var flag = false;
	    $('#table>tbody input:checked').each(function (i, item) {
	    	var id = $(item).val();
	    	var qty = $("#inventoryLocQty-"+id).val();
	    	if(qty == ""){
	    		flag = true;
	    	}
	    	ids += (ids.length==0?"":",") + (id+"_"+qty);
	    	count++;
	    });
		
	    if(flag){
			bootbox.alert('请输入交易数量');
			return;
	    }
		
	    $("#inventoryLocIds").val(ids);
	    if(count == 0){
	    	bootbox.alert('请至少选择一条库存数据');
	    }else{
	    	bootbox.confirm("选中"+count+"行记录，是否移动？", function (result) {
	    		if (result) {
	    			var toLoc = $("#toLoc").val();
	    		    if(toLoc == ""){
	    		    	bootbox.confirm("目标库位为空，是否继续？", function (result) {
	    		            if (result) {
	    		            	form.submit();
	    		            }
	    		    	});
	    		    }else{
	                	form.submit();
	    		    }
	    		}
	    	});
	    }
	});
});
