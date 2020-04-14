$(document).ready(function () {
  /* form init validation */
  var oldDesciption = $("#oldDesciption").val();

  var checkNo = {
        remote: {
        	type:"GET",
        	url:baseUrl + "/check/plantIdAndNo",
        	data:{
        		oldPlantId:oldPlantId,
        		plantId:function(){
        			return $("#plant").val();
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
  
  var checkName = {
	  remote: {
    	  type:"GET",
		  url:baseUrl + "/check/plantIdAndName",
		  data:{
			  oldPlantId:oldPlantId,
			  plantId:function(){
        			return $("#plant").val();
			  },
			  oldName:oldName,
			  name:function(){
    			return $("#name").val();
			  }
      	  }
	  }
  };
  
  // JQuery validate 插件看文档
  // form validation
  $("#warehouseForm").validate({
	  rules: {
	      no:checkNo,
	      name:checkName
	  },
      messages:{
	      no: {
	        remote: "该仓库编号在工厂下已被使用!"
	      },
	      name: {
	        remote: "该仓库名称在工厂下已经被使用!"
	      }
      }
  });
  
  //仓库所在的工厂不能修改
  var plantValue = $('select#plant').val();
  if(plantValue != ''){
	  var obj = $("#plant");
	  var htmltxt = "<input type = hidden value = '"+ obj.val() +"' name = '"+ obj.attr('name') +"'></input>";
	  $('select#plant').attr("disabled","disabled").css("background-color","#EEEEEE;");
	  $("#warehouseForm").append(htmltxt);
  }
  
});

