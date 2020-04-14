$(document).ready(function () {
  // initializing select2
  // link select2 controls
  // 库区联动于仓库
  $("#warehouse").select2({
    ajax: {
      url: rootUrl + "/api/master/warehouses"
    }
  });
  $("#dloc").linkSelect2("warehouse", rootUrl + "/api/master/dlocs", "warehouse");

  /* form init validation */
  var form = $("#locForm");

  var checkNo = {
        remote: {
        	type:"GET",
        	url:baseUrl + "/check/plantIdAndNo",
        	data:{
        		oldId:oldId,
        		warehouseId:function(){
        			return $("#warehouse").val();
        		},
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
    },
    messages: {
      no: {
        remote: "该库位编号在工厂下已被使用!"
      }
    }
  });
  
 //库位所在的仓库、库区不能修改
  var plantValue = $('select#warehouse').val();
  if(plantValue != ''){
	  var obj = $("#warehouse");
	  var htmltxt = "<input type = hidden value = '"+ obj.val() +"' name = '"+ obj.attr('name') +"'></input>";
	  $('select#warehouse').attr("disabled","disabled").css("background-color","#EEEEEE;");
	  $("#locForm").append(htmltxt);
  }
  var plantValue = $('select#dloc').val();
  if(plantValue != ''){
	  var obj = $("#dloc");
	  var htmltxt = "<input type = hidden value = '"+ obj.val() +"' name = '"+ obj.attr('name') +"'></input>";
	  $('select#dloc').attr("disabled","disabled").css("background-color","#EEEEEE;");
	  $("#locForm").append(htmltxt);
  }
 
});
