$(document).ready(function () {
	/* form init validation */
	var form = $("#dlocForm");

	var checkNo = {
	        remote: {
	        	type:"GET",
	        	url:baseUrl + "/check/warehouseIdAndNo",
	        	data:{
	        		oldWarehouseId:oldWarehouseId,
	        		warehouseId:function(){
	        			return $("#warehouse").val();
	        		},
	    			oldNo:oldNo,
	    			no:function(){
	        			return $("#no").val();
	        		}
	        	}
	        },
	        alnum : true,
			maxlength: 50
		};
	
	// JQuery validate 插件看文档
	// form validation
	form.validate({
		rules: {
			no: checkNo
//			,
//			name: {
//				// check username's existence
//				remote: baseUrl + "/check/name?oldName=" + oldName,
//				maxlength: 100
//			}
		},
		messages: {
			no: {
				remote: "该库区编号在仓库下已被使用!"
			},
			name: {
				remote: "该库区名称已经被使用!"
			}
		}
	});
	
	 //库区所在的仓库不能修改
	  var plantValue = $('select#warehouse').val();
	  if(plantValue != ''){
		  var obj = $("#warehouse");
		  var htmltxt = "<input type = hidden value = '"+ obj.val() +"' name = '"+ obj.attr('name') +"'></input>";
		  $('select#warehouse').attr("disabled","disabled").css("background-color","#EEEEEE;");
		  $("#dlocForm").append(htmltxt);
	  }
	  
	//工厂下拉搜索
	$("#warehouse").select2({
		ajax : {
			url : rootUrl + "/api/master/warehouses",
		}
	});
	
});
