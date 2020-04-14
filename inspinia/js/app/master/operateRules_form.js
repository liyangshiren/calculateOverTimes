$(document).ready(function () {
  /* form init validation */
  var checkOperateType = {
        remote: {
        	type:"GET",
        	url:baseUrl + "/check/operateType",
        	data:{
        		operateType : function(){
        			return $("#operateType").val();
        		},
        		oldOperateType : oldOperateType,
        		oldPlantId : oldFromPlantId,
        		plantId : function(){
        			return $("#toPlant").val();
        		}
        	}
        },
        alnum : true,
		maxlength: 50
  };
  
  // JQuery validate 插件看文档
  // form validation
  $("#operateRulesForm").validate({
	  rules: {
	      operateType:checkOperateType
	  },
      messages:{
    	  operateType: {
	        remote: "该操作类型在目标工厂下已存在!"
	      }
      }
  });
  
  // 操作类型不能修改
  var operateTypeValue = $('select#operateType').val();
  if(operateTypeValue != ''){
	  var obj = $("select#operateType");
	  $('select#operateType').attr("disabled","disabled").css("background-color","#EEEEEE;");
  }
  
});

